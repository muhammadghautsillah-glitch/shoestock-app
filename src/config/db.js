require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum diatur di file .env');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  max: 3,
  idleTimeoutMillis: 10000,
});

module.exports = pool;
// Koneksi idle yang diputus database (mis. Neon tidur) tidak boleh mematikan server.
pool.on('error', (err) => {
  console.error('Koneksi database idle error:', err.message);
});