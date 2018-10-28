const { SERVER_PORT } = require('./config.js');
const server = require('./server.js');

server.start(SERVER_PORT);
