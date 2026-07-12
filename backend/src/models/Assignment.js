module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define(
    'Assignment',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      assignmentNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        field: 'assignment_number',
      },
      assetId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'asset_id' },
      userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
      assignmentRequestId: { type: DataTypes.BIGINT.UNSIGNED, field: 'assignment_request_id' },
      assignedBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'assigned_by' },
      assignedAt: { type: DataTypes.DATE, allowNull: false, field: 'assigned_at' },
      expectedReturnDate: { type: DataTypes.DATEONLY, field: 'expected_return_date' },
      returnedAt: { type: DataTypes.DATE, field: 'returned_at' },
      returnedTo: { type: DataTypes.BIGINT.UNSIGNED, field: 'returned_to' },
      returnCondition: {
        type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'damaged'),
        field: 'return_condition',
      },
      returnNotes: { type: DataTypes.TEXT, field: 'return_notes' },
      status: {
        type: DataTypes.ENUM('active', 'returned', 'overdue', 'lost'),
        defaultValue: 'active',
      },
    },
    { tableName: 'assignments', paranoid: false }
  );

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Asset, { foreignKey: 'assetId', as: 'asset' });
    Assignment.belongsTo(models.User, { foreignKey: 'userId', as: 'custodian' });
    Assignment.belongsTo(models.User, { foreignKey: 'assignedBy', as: 'assigner' });
    Assignment.belongsTo(models.User, { foreignKey: 'returnedTo', as: 'returnReceiver' });
    Assignment.belongsTo(models.AssignmentRequest, { foreignKey: 'assignmentRequestId', as: 'request' });
  };

  return Assignment;
};
