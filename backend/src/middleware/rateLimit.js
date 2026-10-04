const rateLimit = require('express-rate-limit');

const authenticatedWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please try again later.',
  },
});

module.exports = {
  authenticatedWriteLimiter,
};
