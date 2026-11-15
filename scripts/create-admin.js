require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function createAdmin() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('ADMIN_USERNAME, ADMIN_EMAIL, dan ADMIN_PASSWORD harus diisi di .env');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (username) DO UPDATE
       SET password_hash = EXCLUDED.password_hash, role = 'admin'`,
      [ADMIN_USERNAME, ADMIN_EMAIL, hash]
    );
    console.log('Akun admin siap:', ADMIN_USERNAME);
  } catch (err) {
    console.error('Gagal membuat admin:', err.message);
  } finally {
    await pool.end();
  }
}

createAdmin();