module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define(
    'AuditLog',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.BIGINT.UNSIGNED, field: 'user_id' },
      action: { type: DataTypes.STRING(50), allowNull: false },
      entityType: { type: DataTypes.STRING(50), allowNull: false, field: 'entity_type' },
      entityId: { type: DataTypes.BIGINT.UNSIGNED, field: 'entity_id' },
      oldValues: { type: DataTypes.JSON, field: 'old_values' },
      newValues: { type: DataTypes.JSON, field: 'new_values' },
      ipAddress: { type: DataTypes.STRING(45), field: 'ip_address' },
      userAgent: { type: DataTypes.STRING(500), field: 'user_agent' },
    },
    { tableName: 'audit_logs', paranoid: false, updatedAt: false }
  );

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return AuditLog;
};
