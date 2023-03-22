const User = require('../models/User');
const AppError = require('../utils/AppError');
const { filterImmutableProperties, isEmpty } = require('../utils/helpers');

const updateUserName = async (userData) => {
  const filteredBody = filterImmutableProperties(
    userData,
    'email',
    'password',
    'passwordConfirm',
    'passwordChangedAt',
    'passwordResetToken',
    'passwordResetExpires'
  );

  return filteredBody;
};

const updateMe = async (reqUser, userData) => {
  const { currentPassword, password, passwordConfirm } = userData;
  if (currentPassword) {
    if (!password || !passwordConfirm) {
      throw new AppError(
        'Please provide all fields to update your password',
        400
      );
    }

    const user = await User.findById(reqUser.id).select('+password');

    if (
      !user ||
      !(await user.correctPassword(currentPassword, user.password))
    ) {
      throw new AppError('Your current password is incorrect', 401);
    }

    if (currentPassword === password || currentPassword === passwordConfirm) {
      throw new AppError(
        'Please provide a password which is different from current password',
        404
      );
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    return {
      status: 'success',
    };
  }

  const user = await User.findById(reqUser.id);
  if (!user) {
    throw new AppError('No user found with that id', 404);
  }

  const filteredBody = await updateUserName(userData);

  const updatedUser = await User.findByIdAndUpdate(reqUser.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(
      'Failed to update user details. Please try again later.',
      500
    );
  }

  return {
    status: 'success',
    data: updatedUser,
  };
};

const createUser = async (userData) => {
  const { email, password, passwordConfirm } = userData;

  if (!email || !password || !passwordConfirm) {
    throw new AppError('Please provide all credentials', 400);
  }

  userData.loginType = {
    standard: { status: true },
  };

  const newUser = await User.create(userData);

  return {
    status: 'success',
    data: newUser,
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('No user found with that id', 404);
  }

  return {
    status: 'success',
    data: user,
  };
};

const updateUser = async (userId, userData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('No user found with that id', 404);
  }
  const filteredBody = await updateUserName(userData);

  const updatedUser = await User.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(
      'Failed to update user details. Please try again later.',
      500
    );
  }

  return {
    status: 'success',
    data: updatedUser,
  };
};

const deleteUser = async (userId) => {
  const userToDelete = await User.findByIdAndDelete(userId);

  if (!userToDelete) {
    throw new AppError('Not able to find that user', 404);
  }
};

const checkEmail = async (userData) => {
  const { email } = userData;
  const updatedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: updatedEmail }).select('+loginType');
  const status = user ? 'success' : 'fail';
  const type = [];
  if (user) {
    if (!isEmpty(user.loginType)) {
      const { standard, google } = user.loginType;
      if (standard.status) type.push('standard');
      if (google.status) type.push('google');
    } else {
      type.push('standard');
    }
  }

  return { status, type };
};

module.exports = {
  updateMe,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
};
