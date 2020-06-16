const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @Desc        Add User to Db
// @ROUTE       POST /api/v1/auth
// @access      Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create a token
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendtokenResponse(user, 200, res);
});

// @Desc        User Log in
// @ROUTE       POST /api/v1/auth
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Credential validation
  if (!email || !password) {
    return next(new ErrorResponse('Invalid Credentials', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  // Check if there is a user
  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  sendtokenResponse(user, 200, res);
});

// Get token from Model , create cookie and send response
const sendtokenResponse = (user, statusCode, res) => {
  // Create a token
  const token = user.getSignedJwtToken();

  //  cookie options
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @Desc        Get Current user
// @ROUTE       POST /api/v1/auth
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
