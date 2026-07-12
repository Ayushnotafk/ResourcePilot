const { Op } = require('sequelize');
const {
  Asset,
  AssetCategory,
  AssetSpecification,
  AssetDocument,
  AssetStatusHistory,
  Assignment,
  Department,
  Location,
  User,
  Vendor,
  sequelize,
} = require('../models');
const { ASSET_STATUS } = require('../constants/assetStates');
const ApiError = require('../utils/ApiError');
const { assertTransition } = require('../utils/stateMachine');
const { createAuditLog } = require('./audit.service');

const assetIncludes = [
  { model: AssetCategory, as: 'category' },
  { model: Department, as: 'department' },
  { model: Location, as: 'location' },
  { model: User, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] },
  { model: Vendor, as: 'vendor' },
  { model: AssetSpecification, as: 'specifications' },
];

const listAssets = async (query, user) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  const where = {};

  if (query.status) where.status = query.status;
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.departmentId) where.departmentId = query.departmentId;
  if (query.locationId) where.locationId = query.locationId;
  if (query.assignedToUserId) where.assignedToUserId = query.assignedToUserId;

  if (query.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { assetTag: { [Op.like]: `%${query.search}%` } },
      { serialNumber: { [Op.like]: `%${query.search}%` } },
      { model: { [Op.like]: `%${query.search}%` } },
    ];
  }

  if (user.roles?.includes('employee') && !user.permissions?.includes('asset.read')) {
    where.assignedToUserId = user.id;
  }

  const { rows, count } = await Asset.findAndCountAll({
    where,
    include: assetIncludes,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  return { assets: rows, meta: { page, limit, total: count } };
};

const getAssetById = async (id, transaction = null) => {
  const options = {
    include: [
      ...assetIncludes,
      { model: AssetDocument, as: 'documents' },
      {
        model: AssetStatusHistory,
        as: 'statusHistory',
        include: [{ model: User, as: 'changer', attributes: ['id', 'firstName', 'lastName'] }],
      },
    ],
  };
  if (transaction) options.transaction = transaction;
  const asset = await Asset.findByPk(id, options);

  if (!asset) throw ApiError.notFound('Asset not found');
  return asset;
};

const createAsset = async (data, userId, req) => {
  return sequelize.transaction(async (t) => {
    const category = await AssetCategory.findByPk(data.categoryId, { transaction: t });
    if (!category) throw ApiError.badRequest('Invalid category');

    if (category.requiresSerial && !data.serialNumber) {
      throw ApiError.badRequest('Serial number is required for this category', 'SERIAL_REQUIRED');
    }

    const asset = await Asset.create(
      {
        ...data,
        status: data.status || ASSET_STATUS.DRAFT,
        createdBy: userId,
        currentValue: data.currentValue ?? data.purchaseCost ?? null,
      },
      { transaction: t }
    );

    if (data.specifications?.length) {
      await AssetSpecification.bulkCreate(
        data.specifications.map((s) => ({ ...s, assetId: asset.id })),
        { transaction: t }
      );
    }

    await AssetStatusHistory.create(
      {
        assetId: asset.id,
        fromStatus: null,
        toStatus: asset.status,
        changedBy: userId,
        reason: 'Asset created',
      },
      { transaction: t }
    );

    await createAuditLog({
      userId,
      action: 'CREATE',
      entityType: 'asset',
      entityId: asset.id,
      newValues: asset.toJSON(),
      req,
    });

    return getAssetById(asset.id, t);
  });
};

const updateAsset = async (id, data, userId, req) => {
  const asset = await Asset.findByPk(id);
  if (!asset) throw ApiError.notFound('Asset not found');

  const oldValues = asset.toJSON();
  const { status, ...mutableData } = data;
  if (status && status !== asset.status) {
    throw ApiError.badRequest('Use transition endpoint to change status', 'USE_TRANSITION');
  }

  await asset.update(mutableData);

  if (data.specifications) {
    await AssetSpecification.destroy({ where: { assetId: id } });
    if (data.specifications.length) {
      await AssetSpecification.bulkCreate(
        data.specifications.map((s) => ({ ...s, assetId: id }))
      );
    }
  }

  await createAuditLog({
    userId,
    action: 'UPDATE',
    entityType: 'asset',
    entityId: id,
    oldValues,
    newValues: asset.toJSON(),
    req,
  });

  return getAssetById(id);
};

const transitionAsset = async (id, toStatus, userId, reason, req) => {
  return sequelize.transaction(async (t) => {
    const asset = await Asset.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!asset) throw ApiError.notFound('Asset not found');

    assertTransition(asset.status, toStatus);

    if (toStatus === ASSET_STATUS.ASSIGNED && !asset.assignedToUserId) {
      throw ApiError.badRequest('Assign a user before marking asset as assigned');
    }

    if ([ASSET_STATUS.RETIRED, ASSET_STATUS.DISPOSED].includes(toStatus)) {
      const activeAssignment = await Assignment.findOne({
        where: { assetId: id, status: 'active' },
        transaction: t,
      });
      if (activeAssignment) {
        throw ApiError.badRequest('Cannot retire asset with active assignment', 'ASSET_HAS_ACTIVE_ASSIGNMENT');
      }
    }

    const fromStatus = asset.status;
    await asset.update({ status: toStatus }, { transaction: t });

    if (toStatus === ASSET_STATUS.IN_STOCK) {
      await asset.update({ assignedToUserId: null }, { transaction: t });
    }

    await AssetStatusHistory.create(
      {
        assetId: id,
        fromStatus,
        toStatus,
        changedBy: userId,
        reason,
      },
      { transaction: t }
    );

    await createAuditLog({
      userId,
      action: 'TRANSITION',
      entityType: 'asset',
      entityId: id,
      oldValues: { status: fromStatus },
      newValues: { status: toStatus, reason },
      req,
    });

    return getAssetById(id, t);
  });
};

const deleteAsset = async (id, userId, req) => {
  const asset = await Asset.findByPk(id);
  if (!asset) throw ApiError.notFound('Asset not found');

  if (![ASSET_STATUS.DRAFT, ASSET_STATUS.RETIRED].includes(asset.status)) {
    throw ApiError.badRequest('Only draft or retired assets can be deleted');
  }

  const activeAssignment = await Assignment.findOne({ where: { assetId: id, status: 'active' } });
  if (activeAssignment) {
    throw ApiError.badRequest('Asset has active assignment', 'ASSET_HAS_ACTIVE_ASSIGNMENT');
  }

  await asset.destroy();

  await createAuditLog({
    userId,
    action: 'DELETE',
    entityType: 'asset',
    entityId: id,
    oldValues: asset.toJSON(),
    req,
  });
};

const getAssetStats = async () => {
  const byStatus = await Asset.findAll({
    attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
    group: ['status'],
    raw: true,
  });

  const byCategory = await Asset.findAll({
    attributes: [
      'categoryId',
      [sequelize.fn('COUNT', sequelize.col('Asset.id')), 'count'],
    ],
    include: [{ model: AssetCategory, as: 'category', attributes: ['name', 'code'] }],
    group: ['categoryId', 'category.id'],
  });

  const totalValue = await Asset.sum('currentValue');

  return {
    byStatus,
    byCategory,
    totalAssets: byStatus.reduce((sum, s) => sum + Number(s.count), 0),
    totalValue: totalValue || 0,
  };
};

const addDocument = async (assetId, file, documentType, userId) => {
  const asset = await Asset.findByPk(assetId);
  if (!asset) throw ApiError.notFound('Asset not found');

  return AssetDocument.create({
    assetId,
    fileName: file.originalname,
    filePath: file.filename,
    fileType: file.mimetype,
    fileSize: file.size,
    documentType: documentType || 'other',
    uploadedBy: userId,
  });
};

module.exports = {
  listAssets,
  getAssetById,
  createAsset,
  updateAsset,
  transitionAsset,
  deleteAsset,
  getAssetStats,
  addDocument,
};
