const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @Desc        get all the bootcamps
// @ROUTE       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  if (!bootcamps) {
    return res.status(401).json({ success: false, data: {} });
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @Desc        get a specific bootcamp
// @ROUTE       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @Desc        create New Bootcamp
// @ROUTE       POST /api/v1/bootcamps
// @access      Private

exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  // console.log(req.body);

  res.status(201).json({
    success: 'True',
    data: bootcamp,
  });
});

// @Desc        Update bootcamp
// @ROUTE       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @Desc        Delete bootcamp
// @ROUTE       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  await Bootcamp.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true });
});
