const moment = require('moment');

// the default port the web server will listen on ( switch to 80 for production )
const DEFAULT_PORT = 8080;

// send an update to the connected clients every X number of milliseconds
const SEND_UPDATE_EVERY = moment.duration(10, "seconds");

// mark switch offline if it has not been updated
const MARK_OFFLINE_AFTER = moment.duration(1, "minute");

// remove switch if it has not been updated
const REMOVE_AFTER = moment.duration(1.5, "minutes");

module.exports = {
	DEFAULT_PORT,
	SEND_UPDATE_EVERY,
	MARK_OFFLINE_AFTER,
	REMOVE_AFTER,
};
