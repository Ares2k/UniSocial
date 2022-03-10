const mongoose = require('mongoose');

const HobbyCounter = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, required: true }
}, { collection: 'counter' });

const counter = mongoose.model('HobbyCounter', HobbyCounter);

module.exports = counter;