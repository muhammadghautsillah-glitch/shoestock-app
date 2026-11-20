
require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./config/db');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const {
  doubleCsrfProtection,
  generateCsrfToken
} = require('./middleware/csrf');

const { requireLogin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Pastikan secret sesi tersedia.
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET belum diatur di file .env');
}

// Pengaturan proxy untuk lingkungan deployment.
if (isProduction) {
  app.set('trust proxy', 1);
}

// Pengaturan tampilan EJS.
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

// Security headers.
app.use(helmet());

// Membaca data formulir.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// File statis tidak perlu melewati session dan CSRF.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Mencegah browser menyimpan halaman dinamis.
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Cookie parser diperlukan untuk membaca cookie CSRF.
app.use(cookieParser());

// Konfigurasi session.
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'session'
    }),

    name: 'shoestock.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2 // 2 jam
    }
  })
);

// Inisialisasi sesi agar identitas sesi tersedia untuk CSRF.
app.use((req, res, next) => {
  req.session.csrfInit = true;
  next();
});

// Perlindungan CSRF.
app.use(doubleCsrfProtection);

// Menyediakan token CSRF ke seluruh tampilan EJS.
app.use((req, res, next) => {
  res.locals.csrfToken = generateCsrfToken(req, res);
  next();
});

// Sediakan data user ke semua tampilan (untuk sidebar)
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes aplikasi.
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/productRoutes'));
app.use('/', require('./routes/stockRoutes'));
app.use('/', require('./routes/reportRoutes'));
app.use('/', require('./routes/logRoutes'));
// Dashboard.
app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.session.user
  });
});

// Halaman utama.
app.get('/', (req, res) => {
  res.render('index', {
    title: 'ShoeStock'
  });
});

// Penanganan error CSRF.
app.use((err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send(
      'Token CSRF tidak valid. Muat ulang halaman dan coba lagi.'
    );
  }

  next(err);
});

// Penanganan error umum.
app.use((err, req, res, next) => {
  console.error('Terjadi kesalahan aplikasi:', err);

  res.status(500).send('Terjadi kesalahan pada server.');
});

// Jalankan server lokal.
// Pada Vercel, aplikasi diekspor melalui module.exports.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
