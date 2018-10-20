const path = require('path');
const http = require('http');
const express = require('express');
const serveIndex = require('serve-index');
const socketIo = require('socket.io');
const logs = require('./logs');

const DEFAULT_PORT = 8080;

function now(){
	return new Date();
}

function getStatusName(data) {
	if(data.inspectionNeeded){
		return "Inspection Needed";
	}
	else if(data.inspectionInProgress){
		return "Inspection In Progress";
	}
	else {
		return "No Inspection Needed";
	}
}

const watchProperties = [
	'inspectionNeeded',
	'inspectionInProgress'
];

let arduinoStatus = {};

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup the endpoints
app.post('/status', (req, res) => {
	let arduinoId = req.body.id;

	if(arduinoId){
		let oldStatus = arduinoStatus[arduinoId] || {};
		let newStatus = req.body || {};

		// check if the status has changed
		let hasChanged = false;
		watchProperties.forEach(prop => {
			if(newStatus[prop] !== oldStatus[prop]){
				hasChanged = true;
			}
		});

		let currentStatus = Object.assign({}, arduinoStatus[arduinoId]);

		// update the arduino status
		currentStatus = Object.assign(currentStatus, newStatus);
		currentStatus.lastUpdate = now();

		if(hasChanged){
			currentStatus.lastChanged = now();

			switchStatusChanged(currentStatus);
		}

		arduinoStatus[arduinoId] = currentStatus;

		res.status(200).end("received\n");
	}
	else {
		res.status(400).end("no id provided\n");
	}

	sendViewerData();
});

app.get('/raw', (req, res) => {
	res.json(arduinoStatus);
});

// serve the app
app.use('/', express.static(path.join(__dirname, 'app')));

// server the log files
app.use('/logs', express.static(path.join(__dirname, logs.logsFolder), {
	setHeaders(res, path, stat){
		// force it to return text/plain so the browser dose not download the file
		res.setHeader('Content-Type', 'text/plain');
	}
}));
app.use('/logs', serveIndex(path.join(__dirname, logs.logsFolder), {icons: true}));

// setup server
let server = http.Server(app);
let sockets = socketIo(server);

sockets.on('connection', (socket) => {
	console.log('[', now(), ']', 'Viewer', `${socket.id} connected`);

	socket.on('disconnect', () => {
		console.log('[', now(), ']', 'Viewer', `${socket.id} disconnected`);
	});

	sendViewerData();
});

// start server
server.listen(process.env.NODE_PORT || DEFAULT_PORT, () => {
	console.log("App", `server started on http://localhost:${process.env.NODE_PORT || DEFAULT_PORT}`);

	sendViewerData();
	setInterval(sendViewerData, 1000 * 5);
});

function sendViewerData() {
	sockets.emit('arduinos', arduinoStatus);
}

function switchStatusChanged(arduino) {
	console.log('[', now(), ']', arduino.name, 'Changed to:', getStatusName(arduino));

	logs.log([
		now().toISOString(),
		arduino.id,
		arduino.name,
		getStatusName(arduino)
	]);
}