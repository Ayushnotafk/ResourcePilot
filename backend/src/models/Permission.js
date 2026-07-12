module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    'Permission',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      module: { type: DataTypes.STRING(50), allowNull: false },
      description: DataTypes.STRING(255),
    },
    { tableName: 'permissions', paranoid: false }
  );

  Permission.associate = (models) => {
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permissionId',
      as: 'roles',
    });
  };

  return Permission;
};
