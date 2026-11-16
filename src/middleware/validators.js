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
const productRules = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nama 2-100 karakter.'),
  body('brand').trim().isLength({ min: 2, max: 50 }).withMessage('Merek 2-50 karakter.'),
  body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Kategori 2-50 karakter.'),
  body('size').trim().isLength({ min: 1, max: 10 }).withMessage('Ukuran 1-10 karakter.'),
  body('color').trim().isLength({ min: 2, max: 30 }).withMessage('Warna 2-30 karakter.'),
  body('price').isFloat({ min: 0, max: 999999999 }).withMessage('Harga harus angka 0 atau lebih.'),
  body('stock').isInt({ min: 0, max: 100000 }).withMessage('Stok harus bilangan bulat 0 atau lebih.'),
];
const stockRules = [
  body('product_id').isInt({ min: 1 }).withMessage('Produk tidak valid.'),
  body('type').isIn(['in', 'out']).withMessage('Jenis harus masuk atau keluar.'),
  body('quantity').isInt({ min: 1, max: 100000 }).withMessage('Jumlah harus bilangan bulat minimal 1.'),
  body('note').optional({ checkFalsy: true }).trim().isLength({ max: 255 }).withMessage('Catatan maksimal 255 karakter.'),
];
module.exports = { registerRules, productRules, stockRules };
