require('dotenv').config();
const app = require('./app');
const config = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
config.connectDB();