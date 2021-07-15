const { Schema, model } = require('mongoose');

const petSchema = Schema({
    name: String,
    species: String,
    breed: String,
    color: String,
    neuter: Boolean,
    gender: String,
    owner: String
});

module.exports = model('Pet', petSchema);
