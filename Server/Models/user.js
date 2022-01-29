const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email     : { type: String, required: true, unique: true },
  password  : { type: String, required: true },
  firstname : { type: String, required: true },
  surname   : { type: String, required: true },
  course    : {
    code: String,
    name: String,
    year: Number
  },
  bio       : { type: String },
  hobbies   : { type: Array, default: [] }
}, {collection: 'users'});

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;