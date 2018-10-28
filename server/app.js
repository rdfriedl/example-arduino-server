const path = require('path');
const express = require('express');
const serveIndex = require('serve-index');
const logs = require('./logs');

let app = express();

app.use(express.json());

// serve the app
app.use('/', express.static(path.join(process.cwd(), 'app')));
app.use('/node_modules/', express.static(path.join(process.cwd(), 'node_modules')));

// server the log files
app.use('/logs', express.static(path.join(process.cwd(), logs.logsFolder), {
	setHeaders(res){
		// force it to return text/plain so the browser dose not download the file
		res.setHeader('Content-Type', 'text/plain');
	}
}));
app.use('/logs', serveIndex(path.join(process.cwd(), logs.logsFolder), {icons: true}));

// api routes
app.use('/api', require('./api'));

module.exports = app;