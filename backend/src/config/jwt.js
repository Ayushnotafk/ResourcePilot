require('dotenv').config();

module.exports = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
  accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
};
