const { body } = require('express-validator');

const createRequestValidator = [
  body('purpose').trim().isLength({ min: 5, max: 2000 }),
  body('neededFrom').isISO8601(),
  body('neededUntil').optional().isISO8601(),
  body('assetId').optional().isInt({ min: 1 }),
  body('categoryId').optional().isInt({ min: 1 }),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
  body('submit').optional().isBoolean(),
];

const approveRequestValidator = [
  body('assetId').optional().isInt({ min: 1 }),
  body('expectedReturnDate').optional().isISO8601(),
];

const returnAssignmentValidator = [
  body('returnCondition').isIn(['excellent', 'good', 'fair', 'poor', 'damaged']),
  body('returnNotes').optional().trim().isLength({ max: 2000 }),
];

module.exports = {
  createRequestValidator,
  approveRequestValidator,
  returnAssignmentValidator,
};
