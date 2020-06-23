const express = require('express');

const {
  registerUser,
  login,
  getMe,
  forgotpassword,
  resetPassword,
} = require('../Controllers/user');

// Route protection middleware
const { protect } = require('../middleware/auth');

// Initializing Router
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

router.post('/forgotpassword', forgotpassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
