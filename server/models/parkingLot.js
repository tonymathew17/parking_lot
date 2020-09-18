const mongoose = require('mongoose');

const ParkingLot = mongoose.Schema({
    parkingLotID: {
        type: String,
        required: true
    },
    totalSlots: {
        type: Number,
        required: true
    },
    availableSlots: {
        type: Number,
        required: true
    },
    slots: {
        type: Array,
        required: true
    },
    carMap: {
        type: Object
    }
});

module.exports = mongoose.model('parkinglot', ParkingLot);