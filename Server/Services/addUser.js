const User = require('../Models/user');

const addUser = async (user) => {
  const { username, email, firstname, surname, password } = user;

  try {
    await User.create({
      username,
      email,
      firstname,
      surname,
      password
    })
    console.log('User created successfully.');
    
  } catch (err) {
    if(err.code === 11000) {
      throw 11000;
    }
    throw err;
  }
}

module.exports = addUser;