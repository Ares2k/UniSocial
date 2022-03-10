const mongoose = require('mongoose');

const HobbiesSchema = new mongoose.Schema({
  value: { type: Number, required: true, unique: true },
  label:  { type: String, required: true, unique: true }
}, { collection: 'hobbies' });

const model = mongoose.model('HobbiesSchema', HobbiesSchema);

module.exports = model;