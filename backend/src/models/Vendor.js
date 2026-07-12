module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    'Vendor',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(200), allowNull: false },
      code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      contactEmail: { type: DataTypes.STRING(255), field: 'contact_email' },
      contactPhone: { type: DataTypes.STRING(20), field: 'contact_phone' },
      address: DataTypes.TEXT,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    },
    { tableName: 'vendors', paranoid: true }
  );

  Vendor.associate = (models) => {
    Vendor.hasMany(models.Asset, { foreignKey: 'vendorId' });
  };

  return Vendor;
};
