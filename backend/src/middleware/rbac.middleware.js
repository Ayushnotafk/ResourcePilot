const ApiError = require('../utils/ApiError');

const requirePermission = (...requiredPermissions) => (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  const hasPermission = requiredPermissions.some((p) => req.permissions.includes(p));
  if (!hasPermission) {
    return next(ApiError.forbidden('Insufficient permissions', 'FORBIDDEN'));
  }
  return next();
};

const requireRole = (...requiredRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  const hasRole = requiredRoles.some((r) => req.roles.includes(r));
  if (!hasRole) {
    return next(ApiError.forbidden('Insufficient role access', 'FORBIDDEN'));
  }
  return next();
};

module.exports = { requirePermission, requireRole };
