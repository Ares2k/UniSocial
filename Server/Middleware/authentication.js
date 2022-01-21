const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { token } = req.body;
  if(!token) return res.json({status: 'error', error: 'Invalid JWT token'});

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.json({status: 'error', error: 'JWT auth failed, check token'});
  }
}