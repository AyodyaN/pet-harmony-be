const { Schema, model } = require('mongoose');

const userSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    mobileNo: Number,
    facebookId: String
});

module.exports = model('User', userSchema);
