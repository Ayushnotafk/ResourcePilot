const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/response');
const { Department, Location, AssetCategory, Vendor, Notification } = require('../models');

exports.listDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.findAll({ order: [['name', 'ASC']] });
  sendSuccess(res, departments);
});

exports.createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  sendCreated(res, department);
});

exports.listLocations = asyncHandler(async (req, res) => {
  const locations = await Location.findAll({
    include: [{ model: Location, as: 'children' }, { model: Location, as: 'parent' }],
    order: [['name', 'ASC']],
  });
  sendSuccess(res, locations);
});

exports.createLocation = asyncHandler(async (req, res) => {
  const location = await Location.create(req.body);
  sendCreated(res, location);
});

exports.listCategories = asyncHandler(async (req, res) => {
  const categories = await AssetCategory.findAll({
    include: [{ model: AssetCategory, as: 'children' }],
    order: [['name', 'ASC']],
  });
  sendSuccess(res, categories);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await AssetCategory.create(req.body);
  sendCreated(res, category);
});

exports.listVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.findAll({ order: [['name', 'ASC']] });
  sendSuccess(res, vendors);
});

exports.createVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.create(req.body);
  sendCreated(res, vendor);
});

exports.dashboard = asyncHandler(async (req, res) => {
  const assetService = require('../services/asset.service');
  const stats = await assetService.getAssetStats();

  const pendingRequests = await require('../models').AssignmentRequest.count({
    where: { status: 'submitted' },
  });

  const activeAssignments = await require('../models').Assignment.count({
    where: { status: 'active' },
  });

  const unreadNotifications = await Notification.count({
    where: { userId: req.user.id, isRead: false },
  });

  sendSuccess(res, {
    ...stats,
    pendingRequests,
    activeAssignments,
    unreadNotifications,
  });
});

exports.listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit: 50,
  });
  sendSuccess(res, notifications);
});

exports.markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.update(
    { isRead: true, readAt: new Date() },
    { where: { id: req.params.id, userId: req.user.id } }
  );
  sendSuccess(res, null, null, 'Marked as read');
});
