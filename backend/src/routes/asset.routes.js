const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const validate = require('../middleware/validate.middleware');
const upload = require('../config/multer');
const { PERMISSIONS } = require('../constants/permissions');
const assetController = require('../controllers/asset.controller');
const {
  createAssetValidator,
  updateAssetValidator,
  transitionValidator,
  listAssetsValidator,
} = require('../validators/asset.validator');

const router = express.Router();

router.use(authenticate);

router.get('/stats/summary', requirePermission(PERMISSIONS.ASSET_READ), assetController.stats);
router.get('/', requirePermission(PERMISSIONS.ASSET_READ), listAssetsValidator, validate, assetController.list);
router.get('/:id', requirePermission(PERMISSIONS.ASSET_READ), assetController.getById);
router.post('/', requirePermission(PERMISSIONS.ASSET_CREATE), createAssetValidator, validate, assetController.create);
router.patch('/:id', requirePermission(PERMISSIONS.ASSET_UPDATE), updateAssetValidator, validate, assetController.update);
router.post('/:id/transition', requirePermission(PERMISSIONS.ASSET_TRANSITION), transitionValidator, validate, assetController.transition);
router.delete('/:id', requirePermission(PERMISSIONS.ASSET_DELETE), assetController.remove);
router.post(
  '/:id/documents',
  requirePermission(PERMISSIONS.ASSET_UPDATE),
  upload.single('file'),
  assetController.uploadDocument
);

module.exports = router;
