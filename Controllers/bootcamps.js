// @Desc        get all the bootcamps
// @ROUTE       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

// @Desc        get a specific bootcamp
// @ROUTE       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

// @Desc        create New Bootcamp
// @ROUTE       POST /api/v1/bootcamps
// @access      Private

exports.createBootCamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Added a new bootcamp' });
};

// @Desc        Update bootcamp
// @ROUTE       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Updated bootcamp ${req.params.id}` });
};

// @Desc        Delete bootcamp
// @ROUTE       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `deleted bootcamp ${req.params.id}` });
};
