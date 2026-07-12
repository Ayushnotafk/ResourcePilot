const { ASSET_TRANSITIONS } = require('../constants/assetStates');
const ApiError = require('./ApiError');

const canTransition = (fromStatus, toStatus) => {
  const allowed = ASSET_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
};

const assertTransition = (fromStatus, toStatus) => {
  if (!canTransition(fromStatus, toStatus)) {
    throw ApiError.badRequest(
      `Invalid transition from '${fromStatus}' to '${toStatus}'`,
      'FORBIDDEN_TRANSITION'
    );
  }
};

module.exports = { canTransition, assertTransition };
