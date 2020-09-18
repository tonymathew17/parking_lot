require('dotenv').config()
// Establishing DB connectivity
require('./server/db/connectToMongodb')();

const http = require('http');
const app = require('./app');

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('App listening on port 3000!');
});