const express = require('express');

const {
  getBootcamp,
  createBootCamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsinRange,
  bootcampPhotoUpload,
} = require('../Controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// include other resource router
const courseRouter = require('./courses');

// Route protection middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Re-routing into other resource router
router.use('/:bootCampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsinRange);

router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('admin', 'publisher'), createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('admin', 'publisher'), updateBootcamp)
  .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

module.exports = router;
