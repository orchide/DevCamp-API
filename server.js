const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// connect to the Database
connectDB();

// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// enable our app to use JSON body data
app.use(express.json());

// Mount router
const bootcamps = require('./Routes/bootcamps');

app.use('/api/v1/bootcamps', bootcamps);

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
