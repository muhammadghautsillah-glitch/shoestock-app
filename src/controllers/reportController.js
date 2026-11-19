const pool = require('../config/db');

const BATAS_MENIPIS = 5;

exports.dashboard = async (req, res) => {
  try {
    const ringkasan = await pool.query(
      `SELECT COUNT(*)::int AS jumlah_produk,
              COALESCE(SUM(stock), 0)::int AS total_stok,
              COUNT(*) FILTER (WHERE stock > 0 AND stock <= $1)::int AS stok_menipis,
              COUNT(*) FILTER (WHERE stock = 0)::int AS stok_habis
       FROM products`,
      [BATAS_MENIPIS]
    );

    const produk = await pool.query(
      'SELECT name, size, stock FROM products ORDER BY stock DESC, name LIMIT 8'
    );

    const riwayat = await pool.query(
      `SELECT m.created_at, p.name, p.size, m.type, m.quantity, m.note, u.username
       FROM stock_movements m
       JOIN products p ON p.id = m.product_id
       LEFT JOIN users u ON u.id = m.user_id
       ORDER BY m.created_at DESC
       LIMIT 10`
    );

    const stokTertinggi = produk.rows.length > 0 ? Math.max(...produk.rows.map((p) => p.stock), 1) : 1;

    res.render('reports/index', {
      title: 'Laporan',
      user: req.session.user,
      ringkasan: ringkasan.rows[0],
      produk: produk.rows,
      stokTertinggi,
      riwayat: riwayat.rows,
      batas: BATAS_MENIPIS,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};

function amankanCsv(nilai) {
  let teks = String(nilai ?? '');
  // Cegah CSV/formula injection di Excel
  if (/^[=+\-@\t\r]/.test(teks)) teks = "'" + teks;
  return '"' + teks.replace(/"/g, '""') + '"';
}

exports.exportCsv = async (req, res) => {
  try {
    const hasil = await pool.query(
      'SELECT id, name, brand, category, size, color, price, stock FROM products ORDER BY id'
    );
    const header = ['ID', 'Nama', 'Merek', 'Kategori', 'Ukuran', 'Warna', 'Harga', 'Stok'];
    const baris = hasil.rows.map((p) =>
      [p.id, p.name, p.brand, p.category, p.size, p.color, p.price, p.stock].map(amankanCsv).join(',')
    );
    const csv = '\uFEFF' + [header.join(','), ...baris].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="data-sepatu.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};