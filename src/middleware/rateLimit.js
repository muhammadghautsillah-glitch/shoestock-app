const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 5,                 // maksimal 5 percobaan per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).render('login', {
      title: 'Login',
      error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
    });
  },
});

module.exports = { loginLimiter };