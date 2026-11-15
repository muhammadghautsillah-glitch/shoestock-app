const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function initDb() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Skema berhasil dijalankan.');

    const hasil = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );
    console.log('Tabel yang ada:');
    hasil.rows.forEach((r) => console.log('-', r.table_name));
  } catch (err) {
    console.error('Gagal menjalankan skema:', err.message);
  } finally {
    await pool.end();
  }
}

initDb();