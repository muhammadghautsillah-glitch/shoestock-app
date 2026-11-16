const pool = require('../config/db');

exports.list = async (req, res) => {
  try {
    const hasil = await pool.query(
      'SELECT id, name, brand, category, size, color, price, stock FROM products ORDER BY id DESC'
    );
    res.render('products/index', {
      title: 'Data Sepatu',
      user: req.session.user,
      products: hasil.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};