require('dotenv').config();
const https = require('https'); // Import HTTPS module
const fs = require('fs'); // Import FileSystem module
const app = require('./app');
const config = require('./config/db');

const PORT = process.env.PORT || 443;

// Load certificates
const privateKey = fs.readFileSync('certificates/private.pem', 'utf8');
const certificate = fs.readFileSync('certificates/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server is running on port ${PORT}`);
});

// Connect to MongoDB
config.connectDB();