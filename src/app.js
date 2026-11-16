require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET belum diatur di file .env');
}

// Wajib di balik proxy (Render) supaya cookie Secure berfungsi
app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    store: new pgSession({ pool, tableName: 'session' }),
    name: 'shoestock.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2, // 2 jam
    },
  })
);
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/productRoutes'));
app.use('/', require('./routes/stockRoutes'));
app.use('/', require('./routes/reportRoutes'));
const { requireLogin } = require('./middleware/auth');
app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});
app.get('/', (req, res) => {
  res.render('index', { title: 'ShoeStock' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});