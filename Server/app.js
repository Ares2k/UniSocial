const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const userRouter = require('./Routes/users');

// const User = require('./Models/user');
// const Hobbies = require('./Models/hobbies');

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;
const db_url = process.env.MONGO_URL;

mongoose.connect(db_url)
.then(console.log('Database Connected...'))
.catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);

app.use((req, res, next) => {
  res.json({
    status: err.status || 404,
    message: 'Route does not exist'});
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: 'Route does not exist'});
});

// app.get('/api/profile', (req, res) => {
//   const { token } = req.body;

//   try {
//     let user = jwt.verify(token, process.env.TOKEN_SECRET);
//     const _id = user.id;
    
//     user = User.findOne({_id});

//     console.log('user: ' + user.username);
//     res.json({status: 'ok', message: 'Your profile is opened'});

//   } catch (error) {
//     console.log(error);
//     return res.json({status: 'error', error: 'Invalid JWT Token'});
//   }
// });

// app.post('/api/change-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     const user = jwt.verify(token, process.env.TOKEN_SECRET);
//     const _id = user.id;
//     const password = await bcrypt.hash(newPassword, 10);

//     await User.updateOne({_id}, {$set: { password }});

//     res.json({status: 'ok', message: 'Password changed successfully'});

//   } catch (error) {
//     console.log(error);
//     return res.json({status: 'error', error: 'Invalid JWT Token'});
//   }
// });

// app.post('/api/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({username}).lean();

//   if(!user) return res.json({status: 'error', error: 'Invalid username/password'});

//   if(await bcrypt.compare(password, user.password)) {
//     const token = jwt.sign({
//       id: user._id,
//       username: user.username
//     }, process.env.TOKEN_SECRET);

//     return res.json({status: 'ok', data: token});
//   }
  
//   res.json({status: 'error', error: 'Invalid username/password'});
// });

// app.post('/api/register', async (req, res) => {
//   const { username, password: plainTextPassword, firstname, surname, email } = req.body;

//   //TODO: Implement additional checks for input fields
//   if(!username || typeof username !== 'string') 
//     return res.json({status: 'error', error: 'Invalid Username'});
  
//   if(!plainTextPassword || typeof plainTextPassword !== 'string')
//     return res.json({status: 'error', error: 'Invalid Username'});

//   if(!firstname || typeof firstname !== 'string')
//     return res.json({status: 'error', error: 'Invalid First Name'});
  
//   if(!surname || typeof surname !== 'string')
//     return res.json({status: 'error', error: 'Invalid Surname'});

//   if(!email || typeof email !== 'string')
//     return res.json({status: 'error', error: 'Invalid Email'});

//   const password = await bcrypt.hash(plainTextPassword, 10);

//   try {
//     await User.create({
//       username,
//       password,
//       firstname,
//       surname,
//       email
//     })
//     console.log('User created successfully');
    
//   } catch (error) {
//     if(error.code === 11000) {
//       return res.send({status: 'error', error: 'Username or email is already in use'});
//     }
//     throw error;
//   }

//   res.json({status: 'ok'});
// });

// // Populate hobbies from txt file line by line
// app.get('/populate-hobbies', (req, res) => {
//   let letter = []
//   fs.readFile('hobbies.txt', async (err, data) => {
//     if(err) throw err;
//     let res = data.toString();

//     for(let i=0; i<res.length; i++) {
//       if(res[i] !== '\n')
//         letter.push(res[i])
//       else {
//         let word = letter.join('')
//         let hobby = word.slice(0, word.length-1)
        
//         try {
//           await Hobbies.create({
//             hobby
//           })  
//         } catch (error) {
//           console.log(error);
//         }

//         letter = []
//       }
//     }
//   })
// });

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
// });

app.listen(port, () => {
  // console.log(`App running on: http://localhost:${port}`);
});