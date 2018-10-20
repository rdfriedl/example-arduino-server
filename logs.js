const path = require('path');
const fs = require('fs');
const logsFolder = process.env.LOG_PATH || 'logs';
const logsPath = path.resolve(__dirname, logsFolder);

// create log dir
if(!fs.existsSync(logsPath)){
	fs.mkdirSync(logsPath);
}

function getCurrentLogFilename() {
	let now = new Date();

	return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.csv`;
}

function log(message) {
	let logFilename = path.resolve(logsPath, getCurrentLogFilename());

	fs.appendFileSync(logFilename, message + '\n');
}

module.exports = {
	log,
	logsFolder
};
