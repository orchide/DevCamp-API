const express = require('express');

const { registerUser } = require('../Controllers/user');

// Initializing Router

const router = express.Router();

router.route('/register').post(registerUser);

module.exports = router;
