const { body } = require('express-validator');

const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username 3-30 karakter.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya huruf, angka, dan underscore.'),
  body('email')
    .trim()
    .isEmail().withMessage('Format email tidak valid.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 10, max: 72 }).withMessage('Password 10-72 karakter.')
    .matches(/[a-z]/).withMessage('Password harus mengandung huruf kecil.')
    .matches(/[A-Z]/).withMessage('Password harus mengandung huruf besar.')
    .matches(/[0-9]/).withMessage('Password harus mengandung angka.')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password harus mengandung simbol.'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Konfirmasi password tidak sama.'),
];

module.exports = { registerRules };