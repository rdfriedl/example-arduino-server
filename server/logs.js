const path = require('path');
const fs = require('fs');
const {now} = require('./utils');

const logsFolder = process.env.LOG_PATH || 'logs';
const logsPath = path.resolve(process.cwd(), logsFolder);

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

function getLogFiles(){
	return fs.readdirSync(logsPath).map(filename => {
		let id = path.parse(filename).name;

		return {
			id,
			filename,
			date: new Date(id)
		}
	})
}

function getParsedLog(id){
	let logFile = getLogFiles().find(file => file.id === id);

	if(!logFile) return [];

	let logFilename = path.resolve(logsPath, logFile.filename);

	if(fs.existsSync(logFilename)){
		try{
			let content = fs.readFileSync(logFilename, {encoding: 'utf8'});

			return content.trim().split('\n').filter(Boolean).map(parseSwitchLogEntry);
		}
		catch(err){
			return [];
		}
	}

	return []
}

function parseSwitchLogEntry(line = '') {
	if(typeof line === 'string'){
		line = line.split(',');
	}

	return {
		date: new Date(line[0]),
		id: line[1],
		state: line[2]
	}
}

function logSwitch(data, date = now()){
	log([
		date,
		data.id,
		data.state
	]);
}

module.exports = {
	log,
	logsFolder,
	getLogFiles,
	getParsedLog,
	logSwitch
};
