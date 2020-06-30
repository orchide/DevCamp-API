const express = require('express');
const advencedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const {
  getUsers,
  createUser,
  updateUser,
  removeUser,
} = require('../Controllers/admin');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), advencedResults(User), getUsers);

router.post('/adduser', protect, authorize('admin'), createUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), removeUser);

module.exports = router;
