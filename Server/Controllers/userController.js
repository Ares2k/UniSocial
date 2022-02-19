const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const addUser = require('../Services/addUser');
const { validateInput, validatePassword } = require('../Services/validate');

const jwt_token = process.env.TOKEN_SECRET;
const jwt_refresh_token = process.env.REFRESH_TOKEN;

let refreshTokens = []

const register = async (req, res) => {
  const { username, email, firstname, surname, password: plainTextPassword } = req.body;

  try {
    validateInput(req.body);
  } catch (err) {
    if(err === 101) return res.json({status: 'Invalid username', error: 'Username must be 5-20 chars in length'});
    if(err === 102) return res.json({status: 'error'           , error: 'Invalid email'});
    if(err === 103) return res.json({status: 'error'           , error: 'Invalid First Name'});
    if(err === 104) return res.json({status: 'error'           , error: 'Invalid Surname'});
    if(err === 105) return res.json({status: 'Invalid password', error: 'Must contain characters with length > 4'});
    if(err === 106) return res.json({status: 'error'           , error: 'Passwords dont match'});
  }

  const password = await bcrypt.hash(plainTextPassword, 10);
  const userDetails = {username, email, firstname, surname, password};

  try {
    await addUser(userDetails);  
  } catch (err) {
    if(err === 11000) return res.json({status: 'error', error: 'Email or username is already in use'});
  }

  res.json({status: 'ok', message: 'Account created Successfully'});
}

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username}).lean();

  if(!user) return res.json({status: 401, error: 'Invalid username/password'});

  if(await bcrypt.compare(password, user.password)) {
    const userDetails = { id: user._id, username: user.username };

    const accessToken = jwt.sign(userDetails, jwt_token, { expiresIn: '15m' });
    const refreshToken = jwt.sign(userDetails, jwt_refresh_token);

    refreshTokens.push(refreshToken);

    console.log(`${user.username} has logged in.`);

    // return res.status(200).json({accessToken});
    return res.json({ status: 200, token: accessToken });
  }

  res.json({ status: 401, error: 'Invalid username/password' });
}

const logout = (req, res) => { 
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.json({status: 200, message: 'Successfully logged out.'});
}

const generateNewToken = (req, res) => {
  //This can go to authentication middleware
  //Same as other auth, just different secret key
  const refreshToken = req.body.token;

  if(!refreshToken) return res.json({status: 'error', message: 'Not authenticated'});
  if(!refreshTokens.includes(refreshToken)) return res.json({status: 'error', message: 'Refresh token is not valid'});

  jwt.verify(refreshToken, jwt_refresh_token, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newToken = jwt.sign(user, jwt_token, { expiresIn: '10m' });
    const newRefreshToken = jwt.sign(user, jwt_refresh_token);

    refreshTokens.push(newRefreshToken);

    res.json({status: 200, message: {
      'token': newToken,
      'refreshToken': newRefreshToken
    }})
  });
}

const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if(!validatePassword(newPassword)) return res.json({status: 'Invalid Password', error: 'Must contain characters with length > 6'});

  const _id = req.user.id;
  const password = await bcrypt.hash(newPassword, 10);

  try {
    await User.updateOne({_id}, {$set: { password }});

    res.json({status: 'ok', message: 'Password Changed Successfully'});

  } catch (err) {
    console.log(err);
    return res.json({status: 'error', error: 'Invalid JWT Token'});
  }
}

const userProfile = async (req, res) => {
  const _id = req.user.id;
  const user = await User.findOne({_id}).lean();

  try {
    res.json({status: 'ok', message: {
      username: user.username,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
      course: user.course,
      year: user.year,
      bio: user.bio,
      hobbies: user.hobbies
    }});
  } catch (err) {
    return res.json({status: 'error', error: err});
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
  } catch (err) {
    console.log(err);
    return res.json({status: 'error', error: 'Error updating users details'});
  }

  res.json({status: 'ok', message: 'User updated'});
}

const mutualUsers = async (req, res) => {
  const userID = req.user.id;

  const user = await User.findOne(
    {_id: userID},
    {_id: 1, username: 1, firstname: 1, surname: 1, bio: 1, course: 1, hobbies: 1}
  ).lean();

  const userHobbies = user.hobbies;
  const userObj = [];

  const mutualUsers = await User.find(
    {_id: {$ne: userID}, hobbies: {$in: userHobbies} },
    {_id: 1, username: 1, firstname: 1, surname: 1, bio: 1, course: 1, hobbies: 1}
  ).lean();

  mutualUsers.forEach(user => {
    let hobbies = [];
    user.hobbies.forEach(hobby => {
      if(userHobbies.includes(hobby)) {
        hobbies.push(hobby);
      }
    })
    userObj.push({
      "_id": user._id,
      "username": user.username,
      "firstname": user.firstname,
      "surname": user.surname,
      "bio": user.bio,
      "hobbies": hobbies});
  })

  userObj.sort((first, next) => {
    return next.hobbies.length - first.hobbies.length;
  });

  // res.status(200).json({users: userObj});
  res.json({ status: 200, users: userObj });     
}

const mutualUser = async (req, res) => {
  const user = await User.findOne(
    {username: req.params.id},
    {username: 1, email: 1, firstname: 1, surname: 1, hobbies: 1, bio: 1, course: 1}
  ).lean();

  if(!user) return res.json({status: 'error', error: 'User not found'});

  res.json({status: 'ok', user: user});
}

module.exports = {
  register,
  login,
  logout,
  generateNewToken,
  changePassword,
  userProfile,
  editUserProfile,
  mutualUsers,
  mutualUser
}