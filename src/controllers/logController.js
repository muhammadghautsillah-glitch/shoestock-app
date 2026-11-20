const pool = require('../config/db');

exports.list = async (req, res) => {
  try {
    const hasil = await pool.query(
      `SELECT l.created_at, l.action, l.detail, l.ip_address, u.username
       FROM activity_logs l
       LEFT JOIN users u ON u.id = l.user_id
       ORDER BY l.created_at DESC
       LIMIT 100`
    );
    res.render('logs/index', {
      title: 'Log Aktivitas',
      user: req.session.user,
      logs: hasil.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};
