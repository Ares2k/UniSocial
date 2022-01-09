const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username:  { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  firstname: { type: String, required: true },
  surname:   { type: String, required: true },
  email:     { type: String, required: true, unique: true }
}, {collection: 'users'});

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;