const express = require('express');

const { registerUser, login, getMe } = require('../Controllers/user');

// Route protection middleware
const { protect } = require('../middleware/auth');

// Initializing Router
const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(login);

router.route('/me').get(protect, getMe);

module.exports = router;
