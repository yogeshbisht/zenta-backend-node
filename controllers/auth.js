const { wrapPromiseResponse } = require('../utils/helpers');
const AuthService = require('../services/Auth');
const { createSendToken } = require('../utils/Auth');

const register = wrapPromiseResponse(async (req, res) => {
  const newUser = await AuthService.register(req.body);

  return createSendToken(newUser, 201, res);
});

const login = wrapPromiseResponse(async (req, res) => {
  const user = await AuthService.login(req.body);

  return createSendToken(user, 200, res);
});

const logout = wrapPromiseResponse(async (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  return {
    status: 200,
    data: {
      status: 'success',
    },
  };
});

const forgotPassword = wrapPromiseResponse(async (req) => {
  const data = await AuthService.forgotPassword(req.body, req.params.token);

  return {
    status: 200,
    data,
  };
});

const resetPassword = wrapPromiseResponse(async (req) => {
  await AuthService.resetPassword(req.body, req.params.token);

  return {
    status: 200,
    data: {
      status: 'success',
    },
  };
});

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
