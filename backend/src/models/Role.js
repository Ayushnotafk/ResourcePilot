module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    'Role',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      displayName: { type: DataTypes.STRING(100), allowNull: false, field: 'display_name' },
      description: DataTypes.TEXT,
      isSystem: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_system' },
    },
    { tableName: 'roles', paranoid: false }
  );

  Role.associate = (models) => {
    Role.belongsToMany(models.User, { through: models.UserRole, foreignKey: 'roleId', as: 'users' });
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      as: 'permissions',
    });
  };

  return Role;
};
