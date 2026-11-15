require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

(async () => {
  const r = await pool.query(
    'SELECT username, role, password_hash FROM users WHERE username = $1',
    [process.env.ADMIN_USERNAME]
  );
  const u = r.rows[0];
  console.log('User ditemukan:', !!u);
  if (u) {
    console.log('Role:', u.role);
    console.log('Password .env cocok dengan hash:', await bcrypt.compare(process.env.ADMIN_PASSWORD, u.password_hash));
  }
  await pool.end();
})();