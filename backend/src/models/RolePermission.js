module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    'RolePermission',
    {
      roleId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, field: 'role_id' },
      permissionId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, field: 'permission_id' },
    },
    { tableName: 'role_permissions', paranoid: false, timestamps: true }
  );

  return RolePermission;
};
