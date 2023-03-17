const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_EMAIL = process.env.GOOGLE_EMAIL_ID;
const CLIENT_ID = process.env.GOOGLE_EMAIL_CLIENT;
const CLIENT_SECRET = process.env.GOOGLE_EMAIL_SECRET;
const REDIRECT_URI = process.env.GSUITE_REDIRECT;
const CLIENT_REFRESH = process.env.GOOGLE_EMAIL_REFRESH;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: CLIENT_REFRESH });

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
  const accessToken = await oAuth2Client.getAccessToken();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: CLIENT_EMAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: CLIENT_REFRESH,
      accessToken: accessToken,
    },
  });

  // send mail with defined transport object
  const mailOptions = await transporter.sendMail({
    from: 'Teach Simple<dev@teachsimple.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
    attachments: options.attachments || [],
  });

  // Send the email and get the promise
  if (mailOptions.messageId) {
    return true;
  }
  return false;
};

module.exports = sendEmail;
