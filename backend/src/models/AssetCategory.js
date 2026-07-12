module.exports = (sequelize, DataTypes) => {
  const AssetCategory = sequelize.define(
    'AssetCategory',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      parentId: { type: DataTypes.BIGINT.UNSIGNED, field: 'parent_id' },
      depreciationYears: { type: DataTypes.INTEGER, field: 'depreciation_years' },
      requiresSerial: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'requires_serial' },
      isBookableResource: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_bookable_resource' },
      icon: DataTypes.STRING(50),
    },
    { tableName: 'asset_categories', paranoid: true }
  );

  AssetCategory.associate = (models) => {
    AssetCategory.belongsTo(AssetCategory, { as: 'parent', foreignKey: 'parentId' });
    AssetCategory.hasMany(AssetCategory, { as: 'children', foreignKey: 'parentId' });
    AssetCategory.hasMany(models.Asset, { foreignKey: 'categoryId' });
  };

  return AssetCategory;
};
