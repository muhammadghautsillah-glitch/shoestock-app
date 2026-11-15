const pool = require('../src/config/db');

async function testKoneksi() {
  try {
    const result = await pool.query('SELECT NOW() AS waktu, current_database() AS db');
    console.log('Koneksi berhasil.');
    console.log('Database:', result.rows[0].db);
    console.log('Waktu server:', result.rows[0].waktu);
  } catch (err) {
    console.error('Koneksi gagal:', err.message);
  } finally {
    await pool.end();
  }
}

testKoneksi();