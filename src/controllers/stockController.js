const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.showForm = async (req, res) => {
  try {
    const produk = await pool.query('SELECT id, name, size, color, stock FROM products ORDER BY name');
    res.render('stock/form', {
      title: 'Stok Masuk/Keluar',
      products: produk.rows,
      errors: [],
      success: req.query.ok === '1',
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};

exports.move = async (req, res) => {
  const result = validationResult(req);
  const produk = await pool.query('SELECT id, name, size, color, stock FROM products ORDER BY name');

  if (!result.isEmpty()) {
    return res.status(400).render('stock/form', {
      title: 'Stok Masuk/Keluar',
      products: produk.rows,
      errors: result.array().map((e) => e.msg),
      success: false,
    });
  }

  const productId = parseInt(req.body.product_id, 10);
  const qty = parseInt(req.body.quantity, 10);
  const type = req.body.type;
  const note = req.body.note || null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const row = await client.query('SELECT stock FROM products WHERE id = $1 FOR UPDATE', [productId]);
    if (row.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).send('Data tidak ditemukan.');
    }

    const stokBaru = type === 'in' ? row.rows[0].stock + qty : row.rows[0].stock - qty;
    if (stokBaru < 0) {
      await client.query('ROLLBACK');
      return res.status(400).render('stock/form', {
        title: 'Stok Masuk/Keluar',
        products: produk.rows,
        errors: ['Stok tidak mencukupi untuk barang keluar.'],
        success: false,
      });
    }

    await client.query('UPDATE products SET stock = $1, updated_at = NOW() WHERE id = $2', [stokBaru, productId]);
    await client.query(
      'INSERT INTO stock_movements (product_id, type, quantity, note, user_id) VALUES ($1, $2, $3, $4, $5)',
      [productId, type, qty, note, req.session.user.id]
    );

    await client.query('COMMIT');
    res.redirect('/stock?ok=1');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  } finally {
    client.release();
  }
};