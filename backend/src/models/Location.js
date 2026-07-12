module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(150), allowNull: false },
      code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      type: {
        type: DataTypes.ENUM('campus', 'building', 'floor', 'room', 'warehouse', 'desk'),
        allowNull: false,
      },
      parentId: { type: DataTypes.BIGINT.UNSIGNED, field: 'parent_id' },
      capacity: DataTypes.INTEGER,
      isBookable: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_bookable' },
      amenities: DataTypes.JSON,
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    },
    { tableName: 'locations', paranoid: true }
  );

  Location.associate = (models) => {
    Location.belongsTo(Location, { as: 'parent', foreignKey: 'parentId' });
    Location.hasMany(Location, { as: 'children', foreignKey: 'parentId' });
    Location.hasMany(models.Asset, { foreignKey: 'locationId' });
  };

  return Location;
};
