const hostname = process.env.HOST;
const port = process.env.PORT || 3000;
const redis_port = process.env.RD_PORT || 6379;

module.exports = { hostname, port, redis_port };
