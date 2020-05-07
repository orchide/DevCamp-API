const Course = require('../models/Course');
const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @Desc        get all the Courses
// @ROUTE       GET /api/v1/courses
// @Route       GET/api/v1/bootcamps/:bootCampId/courses
// @access      Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  // creating a query
  let query;

  // checking if the query is about getting all course or bootcamp specific course
  if (req.params.bootCampId) {
    // get course specific
    query = Course.find({ bootcamp: req.params.bootCampId });
  } else {
    // find all bootcamps
    query = Course.find();
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
