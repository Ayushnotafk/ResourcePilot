const { AuditLog } = require('../models');

const createAuditLog = async ({
  userId,
  action,
  entityType,
  entityId,
  oldValues = null,
  newValues = null,
  req = null,
}) => {
  await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null,
  });
};

module.exports = { createAuditLog };
