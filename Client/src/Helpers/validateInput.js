const validateUsername = (username) => {
  return String(username)
    .match(
      /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
    );
}

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
      /^[A-Za-z]\w{4,20}$/
    );
}

const validateLogin = (body) => {
  const { username, password } = body;
  let usernameErr = "";
  let passwordErr = "";

  if (!username) {
    usernameErr = "Username required";
  }

  if (!password) {
    passwordErr = "Password required";
  }

  return ({
    usernameErr,
    passwordErr,
  });
}

const validateInput = (body) => {
  const { username, email, firstname, surname, password, confirmPassword } = body;
  let usernameErr = "";
  let firstnameErr = "";
  let surnameErr = "";
  let emailErr = "";
  let passwordErr = "";
  let confirmPasswordErr = "";

  if (typeof username !== 'string' || !validateUsername(username)) {
    usernameErr = "Invalid username";
  }

  if (username.length < 5) {
    usernameErr = "Username must have atleast 5 characters";
  }

  if (username.length > 20) {
    usernameErr = "Username must not exceed 20 characters"
  }

  if (!username) {
    usernameErr = "Username required";
  }

  if (typeof email !== 'string' || !validateEmail(email)) {
    emailErr = "Invalid email format";
  }

  if (!email) {
    emailErr = "Email required";
  }

  if (typeof firstname !== 'string') {
    firstnameErr = "Invalid first name";
  }

  if (!firstname) {
    firstnameErr = "First name required";
  }

  if (typeof surname !== 'string') {
    surnameErr = "Invalid surname";
  }

  if (!surname) {
    surnameErr = "Surname required";
  }

  if (typeof password !== 'string' || !validatePassword(password)) {
    passwordErr = "Invalid Password"
  }

  if (password.length < 5) {
    passwordErr = "Password must have atleast 5 characters";
  }

  if (password.length > 20) {
    passwordErr = "Password must not exceed 20 characters";
  }

  if (!password) {
    passwordErr = "Password required";
  }

  if (typeof confirmPassword !== 'string' || !validatePassword(confirmPassword)) {
    confirmPasswordErr = "Invalid Password";
  } 

  if (!confirmPassword) {
    confirmPasswordErr = "Please type your password again";
  }

  if (password !== confirmPassword) {
    confirmPasswordErr = "Passwords don't match";
  }

  return ({usernameErr,
    firstnameErr,
    surnameErr,
    emailErr,
    passwordErr,
    confirmPasswordErr
  });
}

module.exports = {
  validateUsername,
  validateEmail,
  validatePassword,
  validateInput,
  validateLogin
}