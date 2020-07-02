const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @Desc        Get all reviews of a bootcamp
// @Route       GET /api/v1/bootcamps/:bootCampId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // checking if the query is about getting all course or bootcamp specific course
  if (req.params.bootCampId) {
    // get course specific
    const reviews = await Review.find({ bootcamp: req.params.bootCampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @Desc        Get a single review from a bootcamp
// @Route       POST /api/v1/reviews/:id
// @access      private
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(
        "The review couldn't be found ,the review might have been removed"
      )
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @Desc        Update Review
// @Route       PUT /api/v1/reviews/:id
// @access      private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse('Ouups the review might have been deleted'),
      404
    );
  }
  //   check if the user is deleting a review that belongs to themselves
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You can only update a review that you posted', 401)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @Desc        Add a Review to a bootcamp
// @Route       POST /api/v1/bootcamps/:bootCampId/reviews
// @access      private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootCampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootCampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse('Can not review a non existent bootcamp', 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({ success: true, data: review });
});

// @Desc        Delete Review
// @Route       DELETE /api/v1/reviews/:id
// @access      private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse('Ouups the review might have been deleted'),
      404
    );
  }
  //   check if the user is deleting a review that belongs to themselves
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You can only delete a review that you posted', 401)
    );
  }

  review.remove();

  res.status(200).json({ success: true, data: {} });
});
