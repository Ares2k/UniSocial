const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Hobbies = require('../Models/hobbies');
const Conversation = require('../Models/conversations');
const Message = require('../Models/message');
const addUser = require('../Services/addUser');
const { validateInput, validatePassword } = require('../Services/validate');
const { uploadFile, getFileStream } = require('../Services/s3Bucket');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const jwt_token = process.env.TOKEN_SECRET;
const jwt_refresh_token = process.env.REFRESH_TOKEN;

let refreshTokens = []

const populateHobbies = async (req, res) => {
  let letter = [];

  fs.readFile('hobbies.txt', async (err, data) => {
    if (err) throw err;
    const hobbyData = data.toString();

    for (let i = 0; i <= hobbyData.length; i++) {
      if (hobbyData[i] !== '\n')
        letter.push(hobbyData[i])
      else {
        let word = letter.join('')
        let label = word.slice(0, word.length - 1)

        try {
          await Hobbies.create({
            value: label,
            label
          });

        } catch (error) {
          console.log(error);
          return res.json('error');
        }

        letter = []
      }
    }
  })
}

const register = async (req, res) => {
  try {
    const { username, email, firstname, surname, password: plainTextPassword } = req.body;
    validateInput(req.body);

    const password = await bcrypt.hash(plainTextPassword, 10);
    const userObj = { username, email, firstname, surname, password };

    await addUser(userObj);

    const user = await User.findOne({username});
    const userDetails = { id: user._id, username: user.username };

    const accessToken = jwt.sign(userDetails, jwt_token);
    console.log(`${username} has successfully registered.`);

    return res.json({ status: 200, token: accessToken });

  } catch (err) {
    console.log(err)
    if(err === 101) return res.json({status: 101, error: 'Username must be 5-20 chars in length'});
    if(err === 102) return res.json({status: 102, error: 'Invalid email'});
    if(err === 103) return res.json({status: 103, error: 'Invalid First Name'});
    if(err === 104) return res.json({status: 104, error: 'Invalid Surname'});
    if(err === 105) return res.json({status: 105, error: 'Must contain characters with length > 4'});
    if(err === 106) return res.json({status: 106, error: 'Passwords dont match'});
    if(err === 11000) return res.json({ status: 11000, error: 'Email or username is already in use' });
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username}).lean();

  if(!user) return res.json({status: 401, error: 'Invalid username/password'});

  if(await bcrypt.compare(password, user.password)) {
    const userDetails = { id: user._id, username: user.username };

    // const accessToken = jwt.sign(userDetails, jwt_token, { expiresIn: '15m' });
    const accessToken = jwt.sign(userDetails, jwt_token);
    const refreshToken = jwt.sign(userDetails, jwt_refresh_token);

    refreshTokens.push(refreshToken);

    console.log(`${user.username} has logged in.`);

    return res.json({ status: 200, token: accessToken });
  }

  res.json({ status: 401, error: 'Invalid username/password' });
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

const getProfile = async (req, res) => {
  const _id = req.user.id;
  const user = await User.findOne({_id}).lean();

  try {
    res.json({status: 200, user: {
      username: user.username,
      firstname: user.firstname,
      surname: user.surname,
      email: user.email,
      course: user.course,
      year: user.year,
      bio: user.bio,
      hobbies: user.hobbies,
      filename: user.filename,
      banner: user.banner,
      socials: user.socials
    }});
  } catch (err) {
    return res.json({status: 'error', error: err});
  }
}

const updateProfile = async (req, res) => {
  const userID = req.user.id; 
  
  try {
    const { firstname, surname, course, bio, hobbies, socials } = req.body.profile;
    console.log(firstname, surname, course, bio, hobbies);
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
        hobbies: hobbies,
        socials: socials
      }},{upsert: true});
  } catch (err) {
    console.log(err);
    return res.json({status: 'error', error: 'Error updating users details'});
  }

  res.json({status: 200, message: 'User updated'});
}

const mutualUsers = async (req, res) => {
  const userID = req.user.id;

  const user = await User.findOne(
    {_id: userID},
    {
      _id: 1,
      username: 1,
      firstname: 1,
      surname: 1,
      bio: 1,
      course: 1,
      hobbies: 1,
      socials: 1
    }
  ).lean();

  const userHobbies = user.hobbies;
  const userObj = [];

  const mutualUsers = await User.find(
    {_id: {$ne: userID}, hobbies: {$in: userHobbies} },
    {
      _id: 1,
      username: 1,
      firstname: 1,
      surname: 1,
      bio: 1,
      course: 1,
      hobbies: 1,
      filename: 1,
      socials: 1
    }
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
      "hobbies": hobbies,
      "course": user.course,
      "filename": user.filename
    });
  })

  userObj.sort((first, next) => {
    return next.hobbies.length - first.hobbies.length;
  });

  res.json({ status: 200, users: userObj });     
}

const mutualUser = async (req, res) => {
  const userId = req.query.id;
  const username = req.query.username;

  const user = userId
    ? await User.findById(userId, { password: 0 }).lean()
    : await User.findOne({ username }, { password: 0 })

  if(!user) return res.json({status: 404, message: 'User not found'});

  const currentUser = await User.findOne(
    { username: req.user.username },
    { username: 1, hobbies: 1 }
  )

  const mutualHobbies = user.hobbies.filter(hobby => {
    if (currentUser.hobbies.includes(hobby)) {
      return hobby;
    }
  })

  res.json({ status: 200, user, mutualHobbies });
}

const getHobbies = async (req, res) => {
  const hobbies = await Hobbies.find({}, {});
  res.json({status: 200, hobbies});
}

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const userID = req.user.id; 
    let fieldToUpdate = "filename"

    const result = await uploadFile(file);    
    await unlinkFile(file.path);
    
    if (req?.body?.banner)
      fieldToUpdate = "banner";

    await User.updateOne(
      { _id: userID },
      { $set: { [fieldToUpdate]: file.filename } },
      { upsert: true }
    );

    res.json({ imagePath: `/images/${result.Key}` });
  } catch (err) {
    console.log(err);
    return res.json({ status: 401, error: err });
  }
}

const getImage = async (req, res) => {
  const key = req.params.key;

  const readStream = getFileStream(key);
  readStream.pipe(res);
}

const conversations = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    if (!senderId || !receiverId) {
      return res.json({ status: 400, err: "You must specify a senderId and receiverId" });
    }

    let savedConversation = await Conversation.findOne(
      { members: { $all: [senderId, receiverId] } }
    )

    if (savedConversation) {
      return res.json({ status: 200, savedConversation });
    }
    
    const newConversation = new Conversation({
      members: [senderId, receiverId]
    });

    savedConversation = await newConversation.save();
    res.json({ status: 200, savedConversation });
  } catch (err) {
    console.log(err)
    res.json({ status: 500, err });
  }
}

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }
    })

    if (!conversation.length > 0) return res.json({ status: 404, message: "Error conversation not found" });

    res.json({ status: 200, conversation });
  } catch (err) {
    res.json({ status: 500, err });
  }
}

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const newMessage = new Message(message);
    const savedMessage = await newMessage.save();
    res.json({ status: 200, savedMessage });
  } catch (err) {
    res.json({ status: 500, err });
  }
}

const getMessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
    res.json({ status: 200, messages });
  } catch (err) {
    res.json({ status: 500, err });
  }
}

module.exports = {
  register,
  login,
  generateNewToken,
  changePassword,
  getProfile,
  updateProfile,
  mutualUsers,
  mutualUser,
  getHobbies,
  populateHobbies,
  uploadImage,
  getImage,
  conversations,
  getConversation,
  sendMessage,
  getMessage
}