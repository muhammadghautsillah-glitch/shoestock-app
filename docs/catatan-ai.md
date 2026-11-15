# Catatan Penggunaan AI

Aturan: tidak memasukkan password, API key, DATABASE_URL, atau data pribadi ke prompt AI.

## Entri 1 - 15/11/2026

- **Alat AI:** Claude (chat)
- **Bagian yang dibantu:** perencanaan proyek, persiapan lingkungan (VS Code, Node.js, Git), pembuatan akun GitHub/Neon/Render, setup repository dan .gitignore
- **Prompt utama:** "Buatkan project aplikasi stok sepatu step by step sesuai ketentuan tugas Cyber Security. Apa yang harus dimulai dulu, pakai VS Code dan database apa?"
- **Cara saya meninjau/memverifikasi:** menjalankan setiap perintah sendiri di terminal VS Code, memeriksa hasilnya di GitHub (commit dan struktur folder), dan memperbaiki kesalahan lokasi terminal (sempat di System32, lalu dipindah ke folder proyek)

## Entri 2 - 15/11/2026

- **Alat AI:** Claude (chat)
- **Bagian yang dibantu:** inisialisasi proyek Node.js/Express, struktur folder, konfigurasi .env dan .env.example, halaman tes
- **Prompt utama:** "Bantu langkah Tahap 1: fondasi proyek, step by step satu per satu"
- **Cara saya meninjau/memverifikasi:** memeriksa `git status` dan `git check-ignore` agar `.env` tidak ter-commit, memperbaiki salah ketik nama file (`index,ejs` menjadi `index.ejs`), memperbaiki folder yang terbuat sebagai file, dan menjalankan `npm run dev` untuk memastikan halaman tampil

## Entri 3 - 15/11/2026

- **Alat AI:** Claude (chat)
- **Bagian yang dibantu:** koneksi database PostgreSQL (Neon), rancangan skema tabel (users, products, stock_movements, activity_logs, session), skrip inisialisasi database
- **Prompt utama:** "Bantu langkah Tahap 2: database, hubungkan ke Neon dan buat tabel"
- **Cara saya meninjau/memverifikasi:** memastikan `DATABASE_URL` hanya ada di `.env`, memperbaiki connection string yang awalnya masih berisi titik-titik (error ENOTFOUND), menjalankan `node scripts/test-db.js` dan `node scripts/init-db.js` untuk memastikan koneksi dan tabel terbentuk, serta menghilangkan peringatan SSL dengan `sslmode=verify-full`

## Entri 4 - 16/11/2026

- **Alat AI:** Claude (chat)
- **Bagian yang dibantu:** registrasi, login, logout, hashing password dengan bcrypt, sesi (express-session dengan cookie HttpOnly dan penyimpanan di database), validasi input, middleware otorisasi, skrip pembuatan akun admin
- **Prompt utama:** "Bantu langkah Tahap 3: registrasi, login, dan sesi aman"
- **Cara saya meninjau/memverifikasi:** memeriksa di database bahwa hash password berawalan `$2b$12$` (bukan plaintext), menguji password lemah ditolak, memastikan `/dashboard` dialihkan ke `/login` setelah logout, menyetujui skrip instalasi bcrypt secara manual, dan menelusuri masalah login admin (karakter `#` di `.env` dan autofill browser) dengan skrip `cek-admin.js`