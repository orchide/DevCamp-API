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

const router = express.Router();

// Re-routing into other resource router
router.use('/:bootCampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsinRange);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
