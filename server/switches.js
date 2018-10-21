const db = require('./db');
const logs = require('./logs');
const { now } = require('./utils');

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
	return db.switches.find();
}

function getSwitch(id) {
	return db.switches.find({id})[0] || null;
}

function getOrCreateSwitch(id) {
	let query = {id};

	if(db.switches.find(query).length === 0){
		db.switches.save({ id });
	}

	return db.switches.find(query)[0];
}

function updateSwitch(id, data){
	if(!id) return;

	let switchData = getOrCreateSwitch(id);

	let update = Object.assign({}, data);
	update.state = getSwitchState(data);
	update.lastUpdate = now();

	if(update.state !== switchData.state){
		update.lastStateChange = now();

		// log switch change
		console.log('[', now(), ']', update.id, 'Changed to:', update.state);
		logs.logSwitch(update);
	}

	db.switches.update({ id }, update);
}

module.exports = {
	getSwitchState,
	getSwitch,
	getSwitches,
	updateSwitch
};
