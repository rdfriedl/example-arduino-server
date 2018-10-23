const path = require('path');
const http = require('http');
const express = require('express');
const serveIndex = require('serve-index');
const socketIo = require('socket.io');
const logs = require('./logs');
const switches = require('./switches');
const {now} = require('./utils');

const DEFAULT_PORT = 8080;

let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve the app
app.use('/', express.static(path.join(process.cwd(), 'app')));
app.use('/node_modules/', express.static(path.join(process.cwd(), 'node_modules')));

// server the log files
app.use('/logs', express.static(path.join(process.cwd(), logs.logsFolder), {
	setHeaders(res, path, stat){
		// force it to return text/plain so the browser dose not download the file
		res.setHeader('Content-Type', 'text/plain');
	}
}));
app.use('/logs', serveIndex(path.join(process.cwd(), logs.logsFolder), {icons: true}));

// api routes
app.use('/api', require('./api'));

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
	sockets.emit('switches', switches.getSwitches());
}