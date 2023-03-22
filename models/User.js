const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { DEFAULT_CURRENCY_UNIT } = require('../constants');

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    loginType: {
      standard: { status: { type: Boolean, default: false } },
      google: {
        status: { type: Boolean, default: false },
        user: { type: String, default: '' },
      },
    },
    lastLogin: { type: Date, default: () => moment().format() },
    password: { type: String, select: false },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same',
      },
    },
    appTitle: { type: String, default: 'Zentaflow' },
    currency: { type: String, default: DEFAULT_CURRENCY_UNIT },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    joinedDate: { type: Date, default: () => moment().format() },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password whenever a new one is created
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

// Counter database save delay function
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// METHODS ***
// compare entered password with the correct password
UserSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

// compare social login id for validation
UserSchema.methods.correctLoginType = function (socialId, loginId) {
  return bcrypt.compare(socialId, loginId);
};

// check whether password is changed after allowed time
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// create password reset token
UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
