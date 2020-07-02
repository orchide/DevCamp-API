const dotenv = require('dotenv');
const path = require('path');
const fileupload = require('express-fileupload');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitizer = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const ratelimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// connect to the Database
connectDB();

// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Sanitize queries
app.use(mongoSanitizer());

// Set security headers
app.use(helmet());

// Prevent Cross site scripting
app.use(xss());

// number of request limiting
const limiter = ratelimit({
  windowsMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// Make our api public
app.use(cors());

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
const reviews = require('./Routes/reviews');

// Mout Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', admin);
app.use('/api/v1/reviews', reviews);

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
