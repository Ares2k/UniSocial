const mongoose = require('mongoose');

const HobbiesSchema = new mongoose.Schema({
  hobby:  { type: String, required: true, unique: true }
}, {collection: 'hobbies'});

const model = mongoose.model('HobbiesSchema', HobbiesSchema);

module.exports = model;