const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const { User, Role, Permission } = require('../models');

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, jwtConfig.accessSecret);

    const user = await User.findByPk(payload.userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [{ model: Permission, as: 'permissions' }],
        },
        'department',
      ],
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User account is inactive or not found');
    }

    const roles = user.roles.map((r) => r.name);
    const permissions = [
      ...new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.code))),
    ];

    req.user = user;
    req.roles = roles;
    req.permissions = permissions;
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    return next(err);
  }
};

const optionalAuth = async (req, _res, next) => {
  if (!req.headers.authorization) return next();
  return authenticate(req, _res, next);
};

module.exports = { authenticate, optionalAuth };
