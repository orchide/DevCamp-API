const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../Utilities/ErrorResponse');
const User = require('../models/User');

// Protect routes from access of non-logged in users
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //   else if (req.cookies.token){
  //     token = req.cookies.token
  //   }

  //   Make sure token exist

  if (!token) {
    return next(new errorResponse('Access denied', 401));
  }

  try {
    //   Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new errorResponse('Access denied', 401));
  }
});

// Role access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorResponse(`Access not available for ${req.user.role}s`, 403)
      );
    }

    next();
  };
};
