const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if(!req.headers.authorization) {
    return res.json({ status: 401, error: 'JWT token missing' });
  }
  
  const token = req.headers.authorization.split(' ')[1];

  if(!token) {
    return res.json({ status: 401, error: 'Invalid JWT token' });
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.json({ status: 401, error: 'JWT auth failed, check token' });
  }
}