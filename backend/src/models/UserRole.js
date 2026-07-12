module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    'UserRole',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'user_id' },
      roleId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'role_id' },
      assignedAt: { type: DataTypes.DATE, allowNull: false, field: 'assigned_at' },
    },
    { tableName: 'user_roles', paranoid: false }
  );

  return UserRole;
};
