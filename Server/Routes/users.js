const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const checkAuth = require('../Middleware/authentication');

router.post('/register', userController.register);
router.post('/login'   , userController.login);
router.post('/token'   , userController.generateNewToken);
router.get('/hobbies'  , userController.getHobbies);
router.post('/logout'          , checkAuth, userController.logout);
router.post('/change-password' , checkAuth, userController.changePassword);
router.get('/profile'          , checkAuth, userController.getProfile);
router.put('/profile'          , checkAuth, userController.updateProfile);
router.get('/mutual/'          , checkAuth, userController.mutualUsers);
router.get('/mutual/:id'       , checkAuth, userController.mutualUser);
//TODO: Add a delete profile endpoint

module.exports = router;

