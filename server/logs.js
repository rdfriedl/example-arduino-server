const path = require('path');
const fs = require('fs');
const {now} = require('./utils');

const logsFolder = process.env.LOG_PATH || 'logs';
const logsPath = path.resolve(process.cwd(), logsFolder);

// create log dir
if(!fs.existsSync(logsPath)){
	fs.mkdirSync(logsPath);
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
	let logFilename = path.resolve(logsPath, getCurrentLogFilename());

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
	logsFolder,
	logSwitch
};
