const mongoose = require('mongoose');

const URI =
  'mongodb+srv://orchide:mamaor@orchidscontacts-uvppx.mongodb.net/devcamp?retryWrites=true&w=majority';

// environment variable path
// require('dotenv').config({ path: './config.env' });

const connectDB = async () => {
  const conn = await mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB Connected : ${conn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
