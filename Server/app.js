const express = require('express');
// const request = require('request');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./Model/user');
const Hobbies = require('./Model/hobbies');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const fs = require('fs');

// mongoose.connect('mongodb://localhost:27017/unisocial-db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true  
// });

mongoose.connect(process.env.MONGO_URL)
.then(console.log('Database Connected...'))
.catch(err => console.log(err));

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/profile', (req, res) => {
  const { token } = req.body;
});

app.post('/api/change-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(newPassword, 10);

    await User.updateOne({_id}, {$set: { password }});

    res.json({status: 'ok', message: 'Password changed successfully'});

  } catch (error) {
    console.log(error);
    return res.json({status: 'error', error: 'Invalid JWT Token'});
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({username}).lean();

  if(!user) return res.json({status: 'error', error: 'Invalid username/password'});

  if(await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({
      id: user._id,
      username: user.username
    }, process.env.TOKEN_SECRET);

    return res.json({status: 'ok', data: token});
  }
  
  res.json({status: 'error', error: 'Invalid username/password'});
});

app.post('/api/register', async (req, res) => {
  const { username, password: plainTextPassword, firstname, surname, email } = req.body;

  //TODO: Implement additional checks for input fields
  if(!username || typeof username !== 'string') 
    return res.json({status: 'error', error: 'Invalid Username'});
  
  if(!plainTextPassword || typeof plainTextPassword !== 'string')
    return res.json({status: 'error', error: 'Invalid Username'});

  if(!firstname || typeof firstname !== 'string')
    return res.json({status: 'error', error: 'Invalid First Name'});
  
  if(!surname || typeof surname !== 'string')
    return res.json({status: 'error', error: 'Invalid Surname'});

  if(!email || typeof email !== 'string')
    return res.json({status: 'error', error: 'Invalid Email'});

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    await User.create({
      username,
      password,
      firstname,
      surname,
      email
    })
    console.log('User created successfully');
    
  } catch (error) {
    if(error.code === 11000) {
      return res.send({status: 'error', error: 'Username or email is already in use'});
    }
    throw error;
  }

  res.json({status: 'ok'});
});

// Populate hobbies from txt file line by line
app.get('/populate-hobbies', (req, res) => {
  let letter = []
  fs.readFile('hobbies.txt', async (err, data) => {
    if(err) throw err;
    let res = data.toString();

    for(let i=0; i<res.length; i++) {
      if(res[i] !== '\n')
        letter.push(res[i])
      else {
        let word = letter.join('')
        let hobby = word.slice(0, word.length-1)
        
        try {
          await Hobbies.create({
            hobby
          })  
        } catch (error) {
          console.log(error);
        }

        letter = []
      }
    }
  })
});

app.get('/dublin', (req, res) => {
  request(
    'http://api.weatherstack.com/current?access_key=700806f94801261e492a71f24a560e0d&query=Dublin', (error, response, body) => {
      if(!error && response.statusCode === 200) {
        const json = JSON.parse(body);
        const temp = json['current']['temperature'];
        res.send({ temp });
      }  
    }
  );
});

app.listen(port, () => {
  console.log(`App running on: http://localhost:${port}`);
});