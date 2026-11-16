const pool = require('../config/db');
const { validationResult } = require('express-validator');
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
exports.showCreate = (req, res) => {
  res.render('products/form', { title: 'Tambah Sepatu', errors: [], old: {}, action: '/products' });
};

exports.create = async (req, res) => {
  const result = validationResult(req);
  const { name, brand, category, size, color, price, stock } = req.body;

  if (!result.isEmpty()) {
    return res.status(400).render('products/form', {
      title: 'Tambah Sepatu',
      errors: result.array().map((e) => e.msg),
      old: req.body,
      action: '/products',
    });
  }

  try {
    await pool.query(
      `INSERT INTO products (name, brand, category, size, color, price, stock, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, brand, category, size, color, price, stock, req.session.user.id]
    );
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};
exports.showEdit = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) return res.status(404).send('Data tidak ditemukan.');

  try {
    const hasil = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (hasil.rows.length === 0) return res.status(404).send('Data tidak ditemukan.');
    res.render('products/form', {
      title: 'Ubah Sepatu',
      errors: [],
      old: hasil.rows[0],
      action: `/products/${id}/edit`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};

exports.update = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) return res.status(404).send('Data tidak ditemukan.');

  const result = validationResult(req);
  const { name, brand, category, size, color, price, stock } = req.body;

  if (!result.isEmpty()) {
    return res.status(400).render('products/form', {
      title: 'Ubah Sepatu',
      errors: result.array().map((e) => e.msg),
      old: req.body,
      action: `/products/${id}/edit`,
    });
  }

  try {
    const hasil = await pool.query(
      `UPDATE products
       SET name=$1, brand=$2, category=$3, size=$4, color=$5, price=$6, stock=$7, updated_at=NOW()
       WHERE id=$8`,
      [name, brand, category, size, color, price, stock, id]
    );
    if (hasil.rowCount === 0) return res.status(404).send('Data tidak ditemukan.');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};
exports.remove = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) return res.status(404).send('Data tidak ditemukan.');

  try {
    const hasil = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (hasil.rowCount === 0) return res.status(404).send('Data tidak ditemukan.');
    res.redirect('/products');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};