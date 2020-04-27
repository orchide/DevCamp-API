const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../Utilities/geocoder');

// @Desc        get all the bootcamps
// @ROUTE       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //copy req.quer
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort'];

  // loop over request query fields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  // Create Quuery string
  let queryString = JSON.stringify(reqQuery);

  //creating operators ($gte etc)
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding resource
  query = Bootcamp.find(JSON.parse(queryString));

  // SELECT FIELDS
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // SORT
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  // executing the query
  const bootcamps = await query;

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

// @Desc        get bootcamps in a certain zipcode and radius
// @ROUTE       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsinRange = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat and longitude
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of Earth
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
