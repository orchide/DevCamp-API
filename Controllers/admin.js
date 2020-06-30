const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @Desc        Get all users
// @ROUTE       GET /api/v1/auth/users
// @access      private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @Desc        create a user
// @ROUTE       POST /api/v1/auth/users/adduser
// @access      private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  // Create the user
  const user = await User.create(req.body);

  res.status(200).json({ success: true, data: user });
});

// @Desc       Update user
// @ROUTE       PUT /api/v1/auth/users/:id
// @access      private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @Desc        delete user
// @ROUTE       DELETE /api/v1/auth/users/:id
// @access      private/Admin
exports.removeUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});
