const db = require("./db");
const logs = require("./logs");
const moment = require("moment");
const { now } = require("./utils");

const { MARK_OFFLINE_AFTER, REMOVE_AFTER } = require("./config.js");

// creates an arbitrary state string by looking at the switch data
function getSwitchState(switchData) {
	let beforeDate = moment().subtract(MARK_OFFLINE_AFTER);

	if(switchData.lastUpdate && moment(switchData.lastUpdate).isBefore(beforeDate)){
		return "offline";
	}

	if(switchData.inspectionNeeded){
		return "inspection-needed";
	}
	if(switchData.inspectionInProgress){
		return "inspection-in-progress";
	}

	return "no-inspection-needed";
}

function getSwitches() {
	// return all the switches from the switches.json file
	return db.switches.find();
}

function getSwitch(id) {
	// return a specific switch from the switches.json file
	return db.switches.find({id})[0] || null;
}

// returns an existing switch or creates a new one
function getOrCreateSwitch(id) {
	let query = {id};

	if(db.switches.find(query).length === 0){
		db.switches.save({ id });
	}

	return db.switches.find(query)[0];
}

// updates a switch with new data
function updateSwitch(id, data){
	// stop here if the id is not provided
	if(!id) return;

	// get or create the switch
	getOrCreateSwitch(id);

	// create a new switch using the data
	let update = Object.assign({}, data);
	update.lastUpdate = now();

	// write the new switch data to the switches.json file
	db.switches.update({ id }, update);

	return updateSwitchState(id);
}

// update a switches state and remove it if it has not updated is a set amount of time
function updateSwitchState(id){
	let switchData = getOrCreateSwitch(id);
	let didChange = false;

	let newState = getSwitchState(switchData);

	if(newState && !switchData.state){
		// write the new switch data to the switches.json file
		db.switches.update({ id }, {
			state: newState,
			lastStateChange: null,
			firstUpdate: now()
		});

		let message = [now(), id, "online"].join(",");
		logs.log(message);

		didChange = true;
	}
	else if(newState !== switchData.state){
		// if the state has changed, set the "lastStateChange" property to the current time
		let lastStateChange = now();

		// write the new switch data to the switches.json file
		db.switches.update({ id }, {
			state: newState,
			lastStateChange
		});

		logs.logSwitch(getSwitch(id));
		didChange = true;
	}

	// remove the switch if it has not updated with in the set time
	let beforeDate = moment().subtract(REMOVE_AFTER);
	if(switchData.lastUpdate && moment(switchData.lastUpdate).isBefore(beforeDate)){
		db.switches.remove({id});

		let message = [now(), id, "removed"].join(",");
		logs.log(message);
		didChange = true;
	}

	return didChange;
}

module.exports = {
	getSwitchState,
	getSwitch,
	getSwitches,
	updateSwitch,
	updateSwitchState
};
