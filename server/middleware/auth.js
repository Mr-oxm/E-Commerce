// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    console.log('Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified, decoded:', decoded);
    
    console.log('Finding user');
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    console.log('User found:', user.email);
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};