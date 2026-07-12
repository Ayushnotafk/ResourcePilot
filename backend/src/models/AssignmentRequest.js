module.exports = (sequelize, DataTypes) => {
  const AssignmentRequest = sequelize.define(
    'AssignmentRequest',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      requestNumber: { type: DataTypes.STRING(30), allowNull: false, unique: true, field: 'request_number' },
      requesterId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'requester_id' },
      assetId: { type: DataTypes.BIGINT.UNSIGNED, field: 'asset_id' },
      categoryId: { type: DataTypes.BIGINT.UNSIGNED, field: 'category_id' },
      departmentId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'department_id' },
      purpose: { type: DataTypes.TEXT, allowNull: false },
      neededFrom: { type: DataTypes.DATEONLY, allowNull: false, field: 'needed_from' },
      neededUntil: { type: DataTypes.DATEONLY, field: 'needed_until' },
      status: {
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected', 'cancelled'),
        defaultValue: 'draft',
      },
      approverId: { type: DataTypes.BIGINT.UNSIGNED, field: 'approver_id' },
      approvedAt: { type: DataTypes.DATE, field: 'approved_at' },
      rejectionReason: { type: DataTypes.TEXT, field: 'rejection_reason' },
      priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal',
      },
    },
    { tableName: 'assignment_requests', paranoid: false }
  );

  AssignmentRequest.associate = (models) => {
    AssignmentRequest.belongsTo(models.User, { foreignKey: 'requesterId', as: 'requester' });
    AssignmentRequest.belongsTo(models.User, { foreignKey: 'approverId', as: 'approver' });
    AssignmentRequest.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
    AssignmentRequest.belongsTo(models.AssetCategory, { foreignKey: 'categoryId', as: 'category' });
    AssignmentRequest.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    AssignmentRequest.hasOne(models.Assignment, { foreignKey: 'assignmentRequestId', as: 'assignment' });
  };

  return AssignmentRequest;
};
