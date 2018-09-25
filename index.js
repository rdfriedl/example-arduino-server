const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

function now(){
	return new Date();
}

let arduinoStatus = {};

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup the endpoints
app.post('/status', (req, res) => {
	let arduinoId = req.body.id;

	if(arduinoId){
		console.log('[', now(), ']', "Received update from:", arduinoId);

		arduinoStatus[arduinoId] = Object.assign({}, arduinoStatus[arduinoId], req.body);
		arduinoStatus[arduinoId].lastUpdate = now();

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
server.listen(process.env.NODE_PORT || 8000, () => {
	console.log("App", `server started on http://localhost:${process.env.NODE_PORT || 8080}`);

	sendViewerData();
	setInterval(sendViewerData, 1000 * 5);
});

function sendViewerData() {
	sockets.emit('arduinos', arduinoStatus);
}
