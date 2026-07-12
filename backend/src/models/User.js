module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      employeeCode: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'employee_code' },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: 'password_hash' },
      firstName: { type: DataTypes.STRING(100), allowNull: false, field: 'first_name' },
      lastName: { type: DataTypes.STRING(100), allowNull: false, field: 'last_name' },
      phone: DataTypes.STRING(20),
      departmentId: { type: DataTypes.BIGINT.UNSIGNED, field: 'department_id' },
      managerId: { type: DataTypes.BIGINT.UNSIGNED, field: 'manager_id' },
      avatarUrl: { type: DataTypes.STRING(500), field: 'avatar_url' },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
      lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
    },
    {
      tableName: 'users',
      paranoid: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: { attributes: { include: ['passwordHash'] } },
      },
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
    User.belongsTo(User, { as: 'manager', foreignKey: 'managerId' });
    User.belongsToMany(models.Role, { through: models.UserRole, foreignKey: 'userId', as: 'roles' });
    User.hasMany(models.RefreshToken, { foreignKey: 'userId' });
    User.hasMany(models.Asset, { foreignKey: 'assignedToUserId', as: 'assignedAssets' });
    User.hasMany(models.Assignment, { foreignKey: 'userId', as: 'assignments' });
    User.hasMany(models.AssignmentRequest, { foreignKey: 'requesterId', as: 'assignmentRequests' });
  };

  User.prototype.getFullName = function getFullName() {
    return `${this.firstName} ${this.lastName}`;
  };

  return User;
};
