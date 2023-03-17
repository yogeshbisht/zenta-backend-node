const { wrapPromiseResponse } = require('../utils/helpers');

const UserService = require('../services/User');

// controller to handle profile parameters update except critical information
const updateMe = wrapPromiseResponse(async (req) => {
  const data = await UserService.updateMe(req.user, req.body);

  return {
    status: 200,
    data,
  };
});

// controller to prevent admin to create user through this route
const createUser = wrapPromiseResponse(async (req) => {
  const data = await UserService.createUser(req.body);

  return {
    status: 201,
    data,
  };
});

// controller to get user by id
const getUserById = wrapPromiseResponse(async (req) => {
  const data = await UserService.getUser(req.params.id);

  return {
    status: 200,
    data,
  };
});

// controller to handle profile update except critical information
const updateUser = wrapPromiseResponse(async (req) => {
  const data = await UserService.updateUser(req.params.id, req.body);

  return {
    status: 200,
    data,
  };
});

// controller to delete a user by id
const deleteUser = wrapPromiseResponse(async (req) => {
  await UserService.deleteUser(req.params.id);

  return {
    status: 204,
    data: {
      status: 'success',
      data: null,
    },
  };
});

// controller to check existing email
const checkEmail = wrapPromiseResponse(async (req) => {
  const data = await UserService.checkEmail(req.body);
  return {
    status: 200,
    data,
  };
});

module.exports = {
  updateMe,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  checkEmail,
};
