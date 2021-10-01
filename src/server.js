const http = require('http');

const app = require('./app.js');

const { port, hostname } = require('./config.js');

const server = http.createServer(app);

server.listen(port, hostname, (err) => {
  if (err) {
    return console.log('ERROR', err.name);
  }
  console.log(`Server running at http://${hostname}:${port}/`);
});
