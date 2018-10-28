const path = require('path');
const fs = require('fs');
const { now } = require('./utils');
const { LOG_PATH } = require('./config.js');

// create log dir
if(!fs.existsSync(LOG_PATH)){
	fs.mkdirSync(LOG_PATH);
}

/* returns the current log filename */
function getCurrentLogFilename() {
	let now = new Date();

	// Example
	// return "log.csv"

	return `${now.getFullYear()}.csv`;
}

/* append a message to the bottom of the log file */
function log(message) {
	let logFilename = path.resolve(LOG_PATH, getCurrentLogFilename());

	fs.appendFileSync(logFilename, message + '\n');
}

/** adds a new entry to the bottom of the log with the switch info */
function logSwitch(switchData, date = now()){
	// message format "date,switch.id,switch.state"
	let message = [
		date,
		switchData.id,
		switchData.state
	].join(',');

	log(message);
}

module.exports = {
	log,
	logSwitch
};
