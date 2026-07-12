const { body } = require('express-validator');

const createDepartmentValidator = [
  body('name').trim().isLength({ min: 2, max: 150 }),
  body('code').trim().isLength({ min: 2, max: 20 }).matches(/^[A-Z0-9_-]+$/),
  body('costCenterCode').optional().trim(),
];

const createLocationValidator = [
  body('name').trim().isLength({ min: 2, max: 150 }),
  body('code').trim().isLength({ min: 2, max: 50 }),
  body('type').isIn(['campus', 'building', 'floor', 'room', 'warehouse', 'desk']),
  body('capacity').optional().isInt({ min: 1 }),
  body('isBookable').optional().isBoolean(),
];

const createCategoryValidator = [
  body('name').trim().isLength({ min: 2, max: 150 }),
  body('code').trim().isLength({ min: 2, max: 50 }),
  body('requiresSerial').optional().isBoolean(),
];

module.exports = {
  createDepartmentValidator,
  createLocationValidator,
  createCategoryValidator,
};
