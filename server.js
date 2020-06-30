const dotenv = require('dotenv');
const path = require('path');
const fileupload = require('express-fileupload');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// connect to the Database
connectDB();

// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body Parse
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// add router file
const bootcamps = require('./Routes/bootcamps');
const courses = require('./Routes/courses');
const auth = require('./Routes/auth');
const admin = require('./Routes/admin');

// Mout Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', admin);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} node on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  // Close server

  server.close(() => {
    process.exit(1);
  });
});
