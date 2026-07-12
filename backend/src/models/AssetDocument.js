module.exports = (sequelize, DataTypes) => {
  const AssetDocument = sequelize.define(
    'AssetDocument',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      assetId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'asset_id' },
      fileName: { type: DataTypes.STRING(255), allowNull: false, field: 'file_name' },
      filePath: { type: DataTypes.STRING(500), allowNull: false, field: 'file_path' },
      fileType: { type: DataTypes.STRING(50), field: 'file_type' },
      fileSize: { type: DataTypes.INTEGER, field: 'file_size' },
      documentType: {
        type: DataTypes.ENUM('invoice', 'warranty', 'manual', 'photo', 'other'),
        defaultValue: 'other',
        field: 'document_type',
      },
      uploadedBy: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false, field: 'uploaded_by' },
    },
    { tableName: 'asset_documents', paranoid: false }
  );

  AssetDocument.associate = (models) => {
    AssetDocument.belongsTo(models.Asset, { foreignKey: 'assetId' });
    AssetDocument.belongsTo(models.User, { foreignKey: 'uploadedBy', as: 'uploader' });
  };

  return AssetDocument;
};
