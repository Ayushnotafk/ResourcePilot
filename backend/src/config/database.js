require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'assetflow',
    password: process.env.DB_PASSWORD || 'assetflow123',
    database: process.env.DB_NAME || 'assetflow',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
    timezone: '+05:30',
  },
  test: {
    username: process.env.DB_USER || 'assetflow',
    password: process.env.DB_PASSWORD || 'assetflow123',
    database: process.env.DB_NAME || 'assetflow_test',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};
