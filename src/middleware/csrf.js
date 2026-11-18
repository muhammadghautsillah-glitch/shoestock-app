
const { doubleCsrf } = require('csrf-csrf');

const isProduction = process.env.NODE_ENV === 'production';

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => {
    if (!process.env.SESSION_SECRET) {
      throw new Error('SESSION_SECRET belum dikonfigurasi.');
    }
    return process.env.SESSION_SECRET;
  },

  getSessionIdentifier: (req) => req.sessionID,

  cookieName: 'shoestock.csrf',

  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
  },

  getCsrfTokenFromRequest: (req) => req.body?._csrf,
});

module.exports = { doubleCsrfProtection, generateCsrfToken };
