const ErrorResponse = require('../Utilities/ErrorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../Utilities/SendEmail');
const crypto = require('crypto');
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

// @Desc        Forgot Password
// @ROUTE       POST /api/v1/auth/forgotpassword
// @access      Public
exports.forgotpassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create URL
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `Oops ! seems you've forgotten your password , Please use the link bellow to restore your password ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset Token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email send' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    next(new ErrorResponse("Email couldn't be sent", 500));
  }

  console.log(resetToken);

  res.status(200).json({ success: true, data: user });
});

// @Desc        Reset password
// @ROUTE       PUT /api/v1/auth/resetpassword/:token
// @access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token ', 400));
  }

  // Set new Password
  user.password = req.body.password;

  // Clear out the former password token fields in the model
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  // Save the changes
  await user.save();

  sendtokenResponse(user, 200, res);

  res.status(200).json({
    success: true,
    data: user,
  });
});

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

// @Desc        Update Current User
// @ROUTE       PUT /api/v1/auth/updatedetails
// @access      Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @Desc        Update Current Password
// @ROUTE       PUT /api/v1/auth/updatepassword
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password

  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;

  await user.save();

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
