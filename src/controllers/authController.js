const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { logActivity } = require('../utils/logger');

exports.showRegister = (req, res) => {
  res.render('register', { title: 'Registrasi', errors: [], old: {} });
};

exports.register = async (req, res) => {
  const result = validationResult(req);
  const { username, email } = req.body;

  if (!result.isEmpty()) {
    return res.status(400).render('register', {
      title: 'Registrasi',
      errors: result.array().map((e) => e.msg),
      old: { username, email },
    });
  }

  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    // Query berparameter ($1, $2, $3) mencegah SQL Injection.
    // Role selalu 'staff'; admin hanya bisa dibuat manual.
    await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [username, email, hash, 'staff']
    );
    logActivity(req, 'REGISTRASI', 'Akun baru terdaftar: ' + username);
    res.redirect('/login');
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).render('register', {
        title: 'Registrasi',
        errors: ['Username atau email sudah terdaftar.'],
        old: { username, email },
      });
    }
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};

exports.showLogin = (req, res) => {
  res.render('login', { title: 'Login', error: null });
};


exports.login = async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const pesanGagal = 'Username atau password salah.';

  try {
    const hasil = await pool.query(
      'SELECT id, username, password_hash, role FROM users WHERE username = $1',
      [String(username || '')]
    );
    const user = hasil.rows[0];

    // Pesan sama untuk username salah / password salah (tidak membocorkan info akun)
    if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash))) {
      await logActivity(
        req,
        'LOGIN_GAGAL',
        'Percobaan login gagal untuk username: ' + String(username || '').slice(0, 50),
        user ? user.id : null
      );
      return res.status(401).render('login', { title: 'Login', error: pesanGagal });
    }

    // Regenerasi sesi saat login untuk mencegah session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Terjadi kesalahan pada server.');
      }
      req.session.user = { id: user.id, username: user.username, role: user.role };
      logActivity(req, 'LOGIN', 'Login berhasil: ' + user.username);
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan pada server.');
  }
};

exports.logout = (req, res) => {
  logActivity(req, 'LOGOUT', 'Logout: ' + (req.session.user ? req.session.user.username : '-'));
  req.session.destroy(() => {
    res.clearCookie('shoestock.sid');
    res.redirect('/login');
  });
};