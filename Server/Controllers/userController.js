const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const jwt_token = process.env.TOKEN_SECRET;

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const validatePassword = (password) => {
  return String(password)
    .match(
      /^[A-Za-z]\w{6,20}$/
    );
}

const register = async (req, res) => {
  const { email, password: plainTextPassword, firstname, surname } = req.body;

  if(!email || typeof email !== 'string' || !validateEmail(email))
    return res.json({status: 'error', error: 'Invalid Email'});

  if(!plainTextPassword || typeof plainTextPassword !== 'string' || !validatePassword(plainTextPassword))
    return res.json({status: 'Invalid Password', error: 'Must contain characters with length > 6'});

  if(!firstname || typeof firstname !== 'string')
    return res.json({status: 'error', error: 'Invalid First Name'});
  
  if(!surname || typeof surname !== 'string')
    return res.json({status: 'error', error: 'Invalid Surname'});

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    await User.create({
      email,
      password,
      firstname,
      surname
    })
    console.log('User created successfully.');
    
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

    console.log(`${user.firstname} has logged in.`);

    return res.json({status: 'ok', user: {
      name: user.firstname,
      surname: user.surname,
      hobbies: user.hobbies,
      token: token
    }});
  }

  res.json({status: 'error', error: 'Invalid username/password'});
}

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if(!newPassword || typeof newPassword !== 'string' || !validatePassword(newPassword)) {
    return res.json({status: 'Invalid Password', error: 'Must contain characters with length > 6'});
  }

  const _id = req.user.id;
  const password = await bcrypt.hash(newPassword, 10);

  try {
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

const editUserProfile = async (req, res) => {
  const { firstname, surname, course, bio, hobbies } = req.body;
  const userID = req.user.id; 

  try {
    await User.updateOne(
      {_id: userID},
      {$set: {
        firstname: firstname,
        surname: surname,
        course: {
          code: course.code,
          name: course.name,
          year: course.year
        },
        bio: bio,
        hobbies: hobbies
      }},{upsert: true});
  } catch (error) {
    console.log(error);
    return res.json({status: 'error', error: 'Error updating users details'});
  }

  res.json({status: 'ok', message: 'User updated'});
}

const mutualUsers = async (req, res) => {
  const userID = req.user.id;

  const user = await User.findOne(
    {_id: userID},
    {_id: 1, firstname: 1, surname: 1, hobbies: 1}
  ).lean();

  const userHobbies = user.hobbies;
  const userObj = [];

  const mutualUsers = await User.find(
    {_id: {$ne: userID}, hobbies: {$in: userHobbies} },
    {_id: 1, firstname: 1, surname: 1, hobbies: 1}
  ).lean();

  mutualUsers.forEach(user => {
    let hobbies = [];
    user.hobbies.forEach(hobby => {
      if(userHobbies.includes(hobby)) {
        hobbies.push(hobby);
      }
    })
    userObj.push({"_id": user._id, "name": user.firstname, "hobbies": hobbies});
  })

  userObj.sort((first, next) => {
    return next.hobbies.length - first.hobbies.length;
  });

  res.json({status: 'ok', users: userObj});     
}

const mutualUser = async (req, res) => {
  const user = await User.findOne({firstname: req.params.id});

  if(!user) return res.json({status: 'error', error: 'User not found'});

  res.json({status: 'ok', user: user});
}

module.exports = {
  register,
  login,
  changePassword,
  userProfile,
  editUserProfile,
  mutualUsers,
  mutualUser
}