const pool = require('../config/db');

// Mencatat aktivitas ke tabel activity_logs.
// Kegagalan mencatat log tidak boleh mengganggu alur utama aplikasi.
async function logActivity(req, action, detail, userIdOverride) {
  try {
    const userId = userIdOverride || (req.session && req.session.user ? req.session.user.id : null);
    const ip = req.ip || null;
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, detail, ip_address) VALUES ($1, $2, $3, $4)',
      [userId, String(action).slice(0, 50), detail ? String(detail).slice(0, 255) : null, ip]
    );
  } catch (err) {
    console.error('Gagal mencatat log aktivitas:', err.message);
  }
}

module.exports = { logActivity };