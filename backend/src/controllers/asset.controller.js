const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/response');
const assetService = require('../services/asset.service');

exports.list = asyncHandler(async (req, res) => {
  const user = { id: req.user.id, roles: req.roles, permissions: req.permissions };
  const result = await assetService.listAssets(req.query, user);
  sendSuccess(res, result.assets, result.meta);
});

exports.getById = asyncHandler(async (req, res) => {
  const asset = await assetService.getAssetById(req.params.id);
  sendSuccess(res, asset);
});

exports.create = asyncHandler(async (req, res) => {
  const asset = await assetService.createAsset(req.body, req.user.id, req);
  sendCreated(res, asset);
});

exports.update = asyncHandler(async (req, res) => {
  const asset = await assetService.updateAsset(req.params.id, req.body, req.user.id, req);
  sendSuccess(res, asset);
});

exports.transition = asyncHandler(async (req, res) => {
  const asset = await assetService.transitionAsset(
    req.params.id,
    req.body.toStatus,
    req.user.id,
    req.body.reason,
    req
  );
  sendSuccess(res, asset, null, 'Status updated');
});

exports.remove = asyncHandler(async (req, res) => {
  await assetService.deleteAsset(req.params.id, req.user.id, req);
  sendSuccess(res, null, null, 'Asset deleted');
});

exports.stats = asyncHandler(async (req, res) => {
  const stats = await assetService.getAssetStats();
  sendSuccess(res, stats);
});

exports.uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) throw require('../utils/ApiError').badRequest('File is required');
  const doc = await assetService.addDocument(
    req.params.id,
    req.file,
    req.body.documentType,
    req.user.id
  );
  sendCreated(res, doc);
});
