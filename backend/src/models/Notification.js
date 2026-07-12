module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
      type: { type: DataTypes.STRING(50), allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: false },
      entityType: { type: DataTypes.STRING(50), field: 'entity_type' },
      entityId: { type: DataTypes.BIGINT.UNSIGNED, field: 'entity_id' },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_read' },
      readAt: { type: DataTypes.DATE, field: 'read_at' },
    },
    { tableName: 'notifications', paranoid: false, updatedAt: false }
  );

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Notification;
};
