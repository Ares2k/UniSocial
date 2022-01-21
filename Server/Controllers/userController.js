const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const jwt_token = process.env.TOKEN_SECRET;

const register = async (req, res) => {
  const { email, password: plainTextPassword, firstname, surname } = req.body;

  //TODO: Implement additional checks for input fields
  // if(!username || typeof username !== 'string') 
  //   return res.json({status: 'error', error: 'Invalid Username'});
  
  if(!email || typeof email !== 'string')
    return res.json({status: 'error', error: 'Invalid Email'});

  if(!plainTextPassword || typeof plainTextPassword !== 'string')
    return res.json({status: 'error', error: 'Invalid Password'});

  if(!firstname || typeof firstname !== 'string')
    return res.json({status: 'error', error: 'Invalid First Name'});
  
  if(!surname || typeof surname !== 'string')
    return res.json({status: 'error', error: 'Invalid Surname'});

  const password = await bcrypt.hash(plainTextPassword, 10);
  const bio = 'No information given.';

  try {
    await User.create({
      email,
      password,
      firstname,
      surname,
      bio
    })
    console.log('User created successfully');
    
  } catch (error) {
    if(error.code === 11000) {
      return res.json({status: 'error', error: 'Email is already in use'});
    }
    throw error;
  }

  res.json({
    status: 'ok',
    message: {
      firstname: firstname,
      surname: surname,
      email: email,
    }});
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email}).lean();

  if(!user) return res.json({status: 'error', error: 'Invalid username/password'});

  if(await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, jwt_token);

    return res.json({status: 'ok', data: token});
  }
  
  res.json({status: 'error', error: 'Invalid username/password'});
}

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const _id = req.user.id;
    const password = await bcrypt.hash(newPassword, 10);

    await User.updateOne({_id}, {$set: { password }});

    res.json({status: 'ok', message: 'Password Changed Successfully'});

  } catch (error) {
    console.log(error);
    return res.json({status: 'error', error: 'Invalid JWT Token'});
  }
}

const userProfile = async (req, res) => {
  const _id = req.user.id;
  const user = await User.findOne({_id}).lean();

  try {
    res.json({status: 'ok', message: {
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
      course: user.course,
      year: user.year,
      bio: user.bio,
      hobbies: user.hobbies
    }});
  } catch (error) {
    console.log(error);
    return res.json({status: 'error', error: error});
  }
  
}

const userProfileEdit = async (req, res) => {
  const { firstname, surname, course, year, bio, hobbies } = req.body;
  const userID = req.user.id;

  try {
    await User.updateOne(
      {_id: userID},
      {$set: {
        firstname: firstname,
        surname: surname,
        course: course,
        year: year,
        bio: bio
      },
      $addToSet: {hobbies: hobbies}},
      {upsert: true}
    );
  } catch (error) {
    console.log(error);
    return res.json({status: 'error', error: 'Error updating user'});
  }

  res.json({status: 'ok', message: 'User updated'});
}

module.exports = {
  register,
  login,
  changePassword,
  userProfile,
  userProfileEdit
}