const express = require('express');
const dotenv = require('dotenv');

// load env vars

dotenv.config({ path: './config/config.env' });

const app = express();

// Mout router

const bootcamps = require('./Routes/bootcamps');

app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} node on port ${PORT}`)
);
