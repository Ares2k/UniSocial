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
    throw err;
  }
}

module.exports = addUser;