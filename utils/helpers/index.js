const globalErrorHandler = require('../ErrorHandler');

const wrapPromiseResponse = function (responseHandler) {
  return function (req, res) {
    try {
      responseHandler(req, res)
        .then((result) => {
          const { status, data } = result;
          res.status(status).json(data);
        })
        .catch((error) => {
          globalErrorHandler(error, req, res);
        });
    } catch (responseHandlerError) {
      globalErrorHandler(responseHandlerError, req, res);
    }
  };
};

const wrapPromiseErrorCatch = function (responseHandler) {
  return function (req, res, next) {
    try {
      Promise.resolve(responseHandler(req, res, next)).catch((error) => {
        globalErrorHandler(error, req, res);
      });
    } catch (responseHandlerError) {
      globalErrorHandler(responseHandlerError, req, res);
    }
  };
};

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

const slugify = (string) => {
  const normalizedName = string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return normalizedName
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const filterImmutableProperties = (obj, ...immutableFields) =>
  Object.keys(obj)
    .filter((key) => !immutableFields.includes(key))
    .reduce((newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    }, {});

module.exports = {
  wrapPromiseResponse,
  wrapPromiseErrorCatch,
  isEmpty,
  slugify,
  filterImmutableProperties,
};
