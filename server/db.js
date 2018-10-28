const fs = require('fs');
const diskdb = require('diskdb');
const { DB_PATH } = require('./config.js');

// create data dir if it dose not exist
if(!fs.existsSync(DB_PATH)){
	fs.mkdirSync(DB_PATH);
}

const db = diskdb.connect(DB_PATH, ['switches']);

module.exports = db;