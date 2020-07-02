const express = require('express');

const {
  getReviews,
  addReview,
  getReview,
  updateReview,
  deleteReview,
} = require('../Controllers/Reviews');

// Route protection middleware
const { protect, authorize } = require('../middleware/auth');

const Review = require('../models/Review');

// Advance results middleware function
const advancedResults = require('../middleware/advancedResults');

// Merging params from the bootcamp route
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(protect, getReview);

router.put('/:id', protect, authorize('user', 'admin'), updateReview);
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
