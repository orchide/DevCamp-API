const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @Desc        Add User to Db
// @ROUTE       GET /api/v1/auth
// @access      Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  res.status(200).json({ success: true });
});
