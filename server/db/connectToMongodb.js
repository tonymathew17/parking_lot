const mongoose = require('mongoose');
const mongoURL = require('../config/configuration.json').dbUrl;

const connect = () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
    mongoose.connect(mongoURL, options, (err, data) => {
        if (err) {
            console.log(`There was an error connecting to MongoDb: ${err}`);
        } else {
            console.log(`Connected to MongoDB! ${data.connections[0]._connectionString}`);
        }
    });
}

module.exports = connect;