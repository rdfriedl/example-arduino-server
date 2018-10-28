const server = require('./server.js');

// the default port the web server will listen on ( switch to 80 for production )
const DEFAULT_PORT = 8080;

server.start(process.env.NODE_PORT || DEFAULT_PORT);
