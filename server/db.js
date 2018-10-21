const fs = require('fs');
const path = require('path');
const diskdb = require('diskdb');

let dbPath = process.env.DB_PATH || path.resolve(process.cwd(), 'data');

// create log dir
if(!fs.existsSync(dbPath)){
	fs.mkdirSync(dbPath);
}

const db = diskdb.connect(dbPath, ['switches']);

module.exports = db;