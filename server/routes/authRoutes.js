// routes/authRoutes.js
const express = require('express');
const { 
    signup, 
    login, 
    logout, 
    forgotPassword, 
    resetPassword, 
    verifyEmail, 
    changePassword, 
    getUserData,
    updateUserData,
    getUserById
  } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/verifyemail', protect, verifyEmail);
router.put('/changepassword', protect, changePassword);
router.get('/user', protect, getUserData);
router.post('/updateuser', protect, updateUserData);
router.get('/user/:id', getUserById);

module.exports = router;