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

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`,
    });
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Email could not be sent' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    user.isVerified = true;
    await user.save();
    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
    const allowedUpdates = ['username', 'email', 'profile.fullName', 'profile.address', 'profile.phoneNumber', 'profile.bio'];
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

    const needsOnboarding = !user.profile.fullName;
    res.status(200).json({ success: true, data: user, needsOnboarding });
  } catch (error) {
    console.error('Update user data error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};