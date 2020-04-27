const express = require('express');

const {
  getBootcamp,
  createBootCamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsinRange,
} = require('../Controllers/bootcamps');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsinRange);

router.route('/').get(getBootcamps).post(createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
