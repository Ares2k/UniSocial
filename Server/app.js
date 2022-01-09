const express = require('express');
const request = require('request');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./Model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

// mongoose.connect('mongodb://localhost:27017/unisocial-db', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true  
// });

mongoose.connect(process.env.MONGO_URL);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

// app.get('/dublin', (req, res) => {
//   request(
//     'http://api.weatherstack.com/current?access_key=700806f94801261e492a71f24a560e0d&query=Dublin', (error, response, body) => {
//       if(!error && response.statusCode === 200) {
//         const json = JSON.parse(body);
//         const temp = json['current']['temperature'];
//         res.send({ temp });
//       }  
//     }
//   );
// })

// app.get('/custom', (req, res) => {
//   res.send('<h1>HELLO WORLD</h1>');
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})