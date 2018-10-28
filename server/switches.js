const db = require('./db');
const logs = require('./logs');
// const moment = require('moment');
const { now } = require('./utils');

// creates an arbitrary state string by looking at the switch data
function getSwitchState(switchData) {
	if(switchData.inspectionNeeded){
		return "inspection-needed";
	}
	else if(switchData.inspectionInProgress){
		return "inspection-in-progress";
	}
	else {
		return "no-inspection-needed";
	}
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
	let switchData = getOrCreateSwitch(id);

	// create a new switch using the data
	let update = Object.assign({}, data);
	// calculate the new state of the switch
	update.state = getSwitchState(data);
	update.lastUpdate = now();

	if(update.state !== switchData.state){
		// if the state has changed, set the "lastStateChange" property to the current time
		update.lastStateChange = now();

		// log switch change
		console.log('[', now(), ']', update.id, 'Changed to:', update.state);
		logs.logSwitch(update);
	}

	// write the new switch data to the switches.json file
	db.switches.update({ id }, update);
}

// // remove offline switches
// function updateOfflineSwitches(){
// 	let switches = this.getSwitches();
//
// 	switches.forEach(switchData => {
// 		if(switchData.lastUpdate)
// 	})
// }

module.exports = {
	getSwitchState,
	getSwitch,
	getSwitches,
	updateSwitch
};
