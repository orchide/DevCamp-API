const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
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
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @Desc        get a specific course
// @ROUTE       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `Couldn't find course with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @Desc        add a course to a Bootcamp
// @ROUTE       POST /api/v1/bootcamps/bootCampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootCampId;

  const bootcamp = await Bootcamp.findById(req.params.bootCampId);

  if (!bootcamp) {
    return next(new ErrorResponse('No bootcamp with the id provided', 404));
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @Desc        Update Course
// @ROUTE       PUT /api/v1/course/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('No Course with the id provided', 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @Desc        Delete Course
// @ROUTE       DELETE /api/v1/course/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse('No Course with the id provided', 404));
  }

  course.remove();

  res.status(200).json({ success: true, data: {} });
});
