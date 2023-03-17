const sendEmail = require('../utils/SendEmail');
const { FRONTEND_URL } = require('../constants');

const setResetPasswordEmail = async (user, resetToken) => {
  const resetURL = `${FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

  const message = `Hi ${
    user.firstName || user.username
  }, <br /> <br /> We have just received a request to reset your password. <br /> <br /> To continue with the process, Please click on the link: ${resetURL} <br /> <br />The link is valid for only 10 minutes. <br /> <br />If you didn't forget your password, please ignore this email!`;

  return sendEmail({
    email: user.email,
    subject: 'Password reset for Teach Simple',
    message,
  });
};

module.exports = {
  setResetPasswordEmail,
};
