const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username  : { type: String, required: true, unique: true },
  email     : { type: String, required: true, unique: true },
  firstname : { type: String, required: true },
  surname   : { type: String, required: true },
  password  : { type: String, required: true },
  course    : {
    code: String,
    name: String,
    year: Number
  },
  bio       : { type: String },
  hobbies   : { type: Array, default: [] },
  filename  : { type: String, unique: true }
}, {collection: 'users'});

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;