const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary')
const colors = require('colors');
const connectDB = require('./config/db');
const morgan = require('morgan');


// Handle Uncaught exception
process.on('uncaughtException', (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  // Close server
  server.close(() => {
    process.exit(1);
  });
});

// Config Dotenv
dotenv.config({ path: './config/config.env' });

// Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLORDINARY_SECRET,
});

// Connect to Mongodb Database
if (process.env.NODE_ENV != "test") {
    connectDB();
}

// Logger Middleware to log request details using morgan
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"));
}

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).send('Welcome to SanganKriti');
});

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error : ${err.message}`.red);
  // Close server
  server.close(() => {
    process.exit(1);
  });
});
 