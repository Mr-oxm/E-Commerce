// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: err.message });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ success: false, error: 'Unauthorized access' });
    }
  
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
  
    res.status(500).json({ success: false, error: 'Internal server error' });
  };
  
  module.exports = errorHandler;