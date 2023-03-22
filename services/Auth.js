const crypto = require('crypto');
const { DEFAULT_SCENARIOS } = require('../constants');
const Scenario = require('../models/Scenario');

const User = require('../models/User');
const AppError = require('../utils/AppError');

const EmailService = require('./Email');

const register = async (userObject) => {
  const { email, password, passwordConfirm } = userObject;

  if (!email || !password || !passwordConfirm) {
    throw new AppError('Please provide all credentials', 400);
  }

  userObject.loginType = {
    standard: { status: true },
  };

  const newUser = await User.create(userObject);

  if (!newUser) {
    throw new AppError(
      'Failed to create new user. Please try again later',
      500
    );
  }

  await Scenario.insertMany(
    DEFAULT_SCENARIOS.map((scenario) => ({ ...scenario, user: newUser._id }))
  );

  return newUser;
};

const login = async (loginData) => {
  const { email, password } = loginData;

  if (!email || !password) {
    throw new AppError('Please provide all credentials to proceed.', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (user && !user.loginType.standard.status) {
    throw new AppError(
      'You have an account created using one of social networks. Please, try to sign in with Google.',
      401
    );
  }

  if (
    !user ||
    !user.password ||
    !(await user.correctPassword(password, user.password))
  ) {
    throw new AppError('Incorrect username or password', 401);
  }

  const userId = user._id;
  await User.findByIdAndUpdate({ _id: userId }, { lastLogin: new Date() });

  return user;
};

const forgotPassword = async (inputData) => {
  const user = await User.findOne({ email: inputData.email });
  if (!user) {
    throw new AppError('There is no user with provided email address.', 404);
  }

  const { loginType } = user;
  if (loginType && loginType.standard && loginType.standard.status) {
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const response = await EmailService.setResetPasswordEmail(
        user,
        resetToken
      );

      if (response) {
        return {
          status: 'success',
          message: 'Token sent to email!',
        };
      }
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new AppError(
        'There was an error sending the email. Try again later!',
        500
      );
    }
  } else {
    let message = null;
    if (loginType.google.status) {
      message =
        "We've found that your email is registered through Google login.";
    }

    if (message) {
      return {
        status: 'social',
        message,
      };
    }

    throw new AppError('There is no user with provided email address.', 404);
  }
};

const resetPassword = async (inputData, token) => {
  const { password, passwordConfirm, id } = inputData;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    _id: id,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user || !password || !passwordConfirm) {
    throw new AppError('Either token is invalid or it has expired', 400);
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
