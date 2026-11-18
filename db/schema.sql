
-- =====================================================
-- DATABASE SCHEMA: SHOESTOCK
-- Database: PostgreSQL / Neon
-- =====================================================


-- =====================================================
-- 1. TABEL USERS
-- Menyimpan akun admin dan staff
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'staff'
        CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================
-- 2. TABEL PRODUCTS
-- Menyimpan data produk sepatu
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    color VARCHAR(30) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),

    created_by INTEGER
        REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================
-- 3. TABEL STOCK_MOVEMENTS
-- Mencatat transaksi stok masuk dan keluar
-- =====================================================

CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,

    product_id INTEGER NOT NULL
        REFERENCES products(id) ON DELETE CASCADE,

    type VARCHAR(3) NOT NULL
        CHECK (type IN ('in', 'out')),

    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    note VARCHAR(255),

    user_id INTEGER
        REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================
-- 4. TABEL ACTIVITY_LOGS
-- Mencatat aktivitas pengguna
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,

    user_id INTEGER
        REFERENCES users(id) ON DELETE SET NULL,

    action VARCHAR(50) NOT NULL,
    detail VARCHAR(255),
    ip_address VARCHAR(45),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =====================================================
-- 5. TABEL SESSION
-- Menyimpan sesi login Express
-- Digunakan oleh connect-pg-simple
-- =====================================================

CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_expire
    ON session (expire);


-- =====================================================
-- 6. INDEX TAMBAHAN
-- Mempercepat pencarian dan pengambilan data
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_name
    ON products (name);

CREATE INDEX IF NOT EXISTS idx_products_category
    ON products (category);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product
    ON stock_movements (product_id);

CREATE INDEX IF NOT EXISTS idx_stock_movements_created
    ON stock_movements (created_at);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user
    ON activity_logs (user_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created
    ON activity_logs (created_at);


-- =====================================================
-- SELESAI
-- =====================================================
