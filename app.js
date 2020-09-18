const express = require('express');
const app = express();
const parkingLot = require('./server/routes/parkingLot');
const auth = require('./server/routes/authentication');

app.use(express.json());

app.use('/parkingLot', parkingLot);
app.use('/auth', auth);

// Error Handler
app.use((err, req, res, next) => {
    res.status(err.statusCode).json(err);
});

module.exports = app;