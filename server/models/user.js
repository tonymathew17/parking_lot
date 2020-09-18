const mongoose = require("mongoose");

const User = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    isDisabled: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('users', User);