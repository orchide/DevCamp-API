const express = require('express');

const {
  getBootcamp,
  createBootCamp,
  getBootcamps,
  updateBootcamp,
  deleteBootcamp
} = require('../Controllers/bootcamps');

const router = express.Router();

router
  .route('/')
  .get(getBootcamps)
  .post(createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
