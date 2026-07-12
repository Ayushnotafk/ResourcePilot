module.exports = (sequelize, DataTypes) => {
  const AssetSpecification = sequelize.define(
    'AssetSpecification',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      assetId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'asset_id' },
      specKey: { type: DataTypes.STRING(100), allowNull: false, field: 'spec_key' },
      specValue: { type: DataTypes.STRING(255), allowNull: false, field: 'spec_value' },
    },
    { tableName: 'asset_specifications', paranoid: false }
  );

  AssetSpecification.associate = (models) => {
    AssetSpecification.belongsTo(models.Asset, { foreignKey: 'assetId' });
  };

  return AssetSpecification;
};
