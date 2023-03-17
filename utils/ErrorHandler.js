const AppError = require('./AppError');
const logger = require('./logger');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const duplicatedFields = JSON.stringify(
    (err.keyPattern && Object.keys(err.keyPattern)) || []
  );

  const message = `Duplicate field values: ${duplicatedFields}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      ...(err.code && { code: err.code }),
    });
  }

  // B) RENDERED WEBSITE
  return res.status(err.statusCode).json({
    title:
      'Server responded with an error. Please make sure that the URL is valid and try again later!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.code && { code: err.code }),
      });
    }

    return res.status(500).json({
      status: 'error',
      message:
        err.message ||
        'An error occurred while processing that request. Please make sure that the URL is valid and try again later.',
      ...(err.code && { code: err.code }),
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title:
        'Server responded with an error. Please make sure that the URL is valid and try again later!',
      msg: err.message,
      ...(err.code && { code: err.code }),
    });
  }

  return res.status(err.statusCode).json({
    title:
      'Server responded with an error. Please make sure that the URL is valid and try again later!',
    msg: 'Please try again later.',
    ...(err.code && { code: err.code }),
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[ErrorHandler] Error: ${JSON.stringify(err, null, 2)}`);

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    logger.error(
      `[ErrorHandler] Error after transforming: ${JSON.stringify(err, null, 2)}`
    );

    sendErrorProd(error, req, res);
  }
};
