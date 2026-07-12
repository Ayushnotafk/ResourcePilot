const { body, param, query } = require('express-validator');
const { ASSET_STATUS, ASSET_CONDITION } = require('../constants/assetStates');

const createAssetValidator = [
  body('assetTag').trim().isLength({ min: 3, max: 50 }).matches(/^[A-Za-z0-9-]+$/),
  body('name').trim().isLength({ min: 2, max: 200 }),
  body('categoryId').isInt({ min: 1 }),
  body('serialNumber').optional().trim().isLength({ max: 100 }),
  body('purchaseCost').optional().isFloat({ min: 0 }),
  body('condition').optional().isIn(ASSET_CONDITION),
  body('status').optional().isIn(Object.values(ASSET_STATUS)),
];

const updateAssetValidator = [
  param('id').isInt({ min: 1 }),
  body('name').optional().trim().isLength({ min: 2, max: 200 }),
  body('purchaseCost').optional().isFloat({ min: 0 }),
  body('condition').optional().isIn(ASSET_CONDITION),
];

const transitionValidator = [
  param('id').isInt({ min: 1 }),
  body('toStatus').isIn(Object.values(ASSET_STATUS)),
  body('reason').optional().trim().isLength({ max: 1000 }),
];

const listAssetsValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(Object.values(ASSET_STATUS)),
];

module.exports = {
  createAssetValidator,
  updateAssetValidator,
  transitionValidator,
  listAssetsValidator,
};
