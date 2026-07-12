const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT', message: 'Too many login attempts. Try again later.' },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter };
