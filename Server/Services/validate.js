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

const validateInput = (body) => {
  const { username, email, firstname, surname, password, confirmPass } = body;
  
  if(!username        || typeof username        !== 'string' || !validateUsername(username)) throw 101;
  if(!email           || typeof email           !== 'string' || !validateEmail(email)) throw 102;
  if(!firstname       || typeof firstname       !== 'string') throw 103;
  if(!surname         || typeof surname         !== 'string') throw 104;
  if(!password        || typeof password        !== 'string' || !validatePassword(password)) throw 105;
  if(password !== confirmPass) throw 106;
}

module.exports = {
  validateInput,
  validatePassword
}