const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { wrapPromiseErrorCatch } = require('../utils/helpers');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const userAuth = wrapPromiseErrorCatch(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token || token === 'undefined') {
    throw new AppError(
      'You are not logged in! Please log in to get access.',
      401
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError(
      'The user belonging to this token does no longer exist.',
      401
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new AppError(
      'User recently changed password! Please log in again.',
      401
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };

module.exports = {
  restrictTo,
  userAuth,
};
