const mongoose = require('mongoose');

const SocialLink = new mongoose.Schema({
  title: { type: String },
  link:  { type: String },
  image: { type: String }
});

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
  filename  : { type: String },
  banner    : { type: String },
  socials   : [ SocialLink ]
}, { collection: 'users' });

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;