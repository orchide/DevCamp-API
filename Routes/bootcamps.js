const express = require('express');

const {
  getBootcamp,
  createBootCamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsinRange,
} = require('../Controllers/bootcamps');

// include other resource router
const courseRouter = require('./courses');

const router = express.Router();

// Re-routing into other resource router
router.use('/:bootCampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsinRange);

router.route('/').get(getBootcamps).post(createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
