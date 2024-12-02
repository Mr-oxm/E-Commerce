const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');

exports.signup = async (req, res) => {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      
      const { username, email, password, role } = req.body;
      const user = await User.create({ username, email, password, role });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ success: true, token, needsOnboarding: true });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const needsOnboarding = !user.profile.fullName;
    res.status(200).json({ success: true, token, needsOnboarding });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const needsOnboarding = !user.profile.fullName;
    res.status(200).json({ success: true, data: user, needsOnboarding });
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const allowedUpdates = [
      'username', 
      'email', 
      'profile.fullName', 
      'profile.addresses', 
      'profile.phoneNumbers', 
      'profile.bio',
      'profile.profilePhoto'
    ];
    
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ success: false, error: 'Invalid updates!' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    updates.forEach(update => {
      if (update.startsWith('profile.')) {
        const profileField = update.split('.')[1];
        user.profile[profileField] = req.body[update];
      } else {
        user[update] = req.body[update];
      }
    });

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Update user data error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};