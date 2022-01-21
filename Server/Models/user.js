const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  firstname: { type: String, required: true },
  surname:   { type: String, required: true },
  course:    { type: String, required: false },
  year:      { type: Number, required: false },
  bio:       { type: String, required: true },
  hobbies:   { type: Array,  required: false, default: []}
}, {collection: 'users'});

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;