const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(ApiError.unprocessable('Validation failed', 'VALIDATION_ERROR', details));
  }
  return next();
};

module.exports = validate;
