const AppError = require('../utils/AppError');
const { wrapPromiseErrorCatch } = require('../utils/helpers');

const getMe = wrapPromiseErrorCatch(async (req, res, next) => {
  if (!req.user) {
    throw new AppError('You are not logged in. Please login!', 401);
  }
  req.params.id = req.user.id;
  next();
});

module.exports = {
  getMe,
};
