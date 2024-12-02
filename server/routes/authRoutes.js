// routes/authRoutes.js
const express = require('express');
const { 
    signup, 
    login, 
    logout, 
    changePassword, 
    getUserData,
    updateUserData,
    getUserById
  } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../utils/inputValidators');

const router = express.Router();

router.post('/signup', validate(schemas.userSignup), signup);
router.post('/login', login);
router.get('/logout', logout);
router.put('/changepassword', protect, changePassword);
router.get('/user', protect, getUserData);
router.post('/updateuser', protect, updateUserData);
router.get('/user/:id', getUserById);

module.exports = router;