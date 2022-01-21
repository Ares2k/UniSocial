const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const checkAuth = require('../Middleware/authentication');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/change-password', checkAuth, userController.changePassword);
router.get('/profile', checkAuth, userController.userProfile);
router.put('/profile', checkAuth, userController.userProfileEdit);

module.exports = router;

