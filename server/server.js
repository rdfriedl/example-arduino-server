const http = require("http");
const moment = require("moment");
const socketIo = require("socket.io");
const switches = require("./switches.js");
const { SEND_UPDATE_EVERY } = require("./config.js");

const app = require("./app.js");

// create new web server
let server, sockets;

function sendSwitchesToClients() {
	// send the latest switch data to all the connected clients
	if(sockets){
		sockets.emit("switches", switches.getSwitches());
	}
}

function start(port){
	// create new web server
	server = http.Server(app);
	sockets = socketIo(server);

	// listen for when clients connect back to the server
	sockets.on("connection", () => {
		// send the viewer data every time the client connects
		sendSwitchesToClients();
	});

	// start server
	server.listen(port, () => {
		console.log("App", `server started on http://localhost:${port}`);

		// set a timer to send broadcast switch data every 1000 * 5 milliseconds
		setInterval(() => {
			let didChange = false;
			switches.getSwitches().forEach((switchData) => {
				didChange = switches.updateSwitchState(switchData.id) || didChange;
			});

			if(didChange){
				sendSwitchesToClients();
			}
		}, moment.duration(SEND_UPDATE_EVERY).as("milliseconds"));
	});

	return server;
}

module.exports = {
	start,
	sendSwitchesToClients,
};
