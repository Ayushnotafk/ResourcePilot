module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    'Department',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      headUserId: { type: DataTypes.BIGINT.UNSIGNED, field: 'head_user_id' },
      parentId: { type: DataTypes.BIGINT.UNSIGNED, field: 'parent_id' },
      costCenterCode: { type: DataTypes.STRING(50), field: 'cost_center_code' },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    },
    { tableName: 'departments', paranoid: true }
  );

  Department.associate = (models) => {
    Department.belongsTo(models.User, { as: 'head', foreignKey: 'headUserId' });
    Department.belongsTo(Department, { as: 'parent', foreignKey: 'parentId' });
    Department.hasMany(Department, { as: 'children', foreignKey: 'parentId' });
    Department.hasMany(models.User, { foreignKey: 'departmentId' });
    Department.hasMany(models.Asset, { foreignKey: 'departmentId' });
  };

  return Department;
};
