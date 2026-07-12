module.exports = (sequelize, DataTypes) => {
  const AssetStatusHistory = sequelize.define(
    'AssetStatusHistory',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      assetId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'asset_id' },
      fromStatus: { type: DataTypes.STRING(50), field: 'from_status' },
      toStatus: { type: DataTypes.STRING(50), allowNull: false, field: 'to_status' },
      changedBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'changed_by' },
      reason: DataTypes.TEXT,
      metadata: DataTypes.JSON,
    },
    { tableName: 'asset_status_history', paranoid: false, updatedAt: false }
  );

  AssetStatusHistory.associate = (models) => {
    AssetStatusHistory.belongsTo(models.Asset, { foreignKey: 'assetId' });
    AssetStatusHistory.belongsTo(models.User, { foreignKey: 'changedBy', as: 'changer' });
  };

  return AssetStatusHistory;
};
