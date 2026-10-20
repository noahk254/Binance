import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config';

const dir = path.dirname(config.dbPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

export const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Schema is applied idempotently on boot.
 */
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS balances (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset TEXT NOT NULL,
    free REAL NOT NULL DEFAULT 0,
    locked REAL NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, asset)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    market TEXT NOT NULL CHECK (market IN ('SPOT','FUTURES')),
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
    type TEXT NOT NULL CHECK (type IN ('LIMIT','MARKET')),
    price REAL,
    quantity REAL NOT NULL,
    filled_quantity REAL NOT NULL DEFAULT 0,
    leverage REAL,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','FILLED','CANCELED','REJECTED')),
    reduce_only INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL CHECK (side IN ('LONG','SHORT')),
    quantity REAL NOT NULL,
    entry_price REAL NOT NULL,
    leverage REAL NOT NULL,
    margin REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (user_id, symbol, side)
  );

  CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
  CREATE INDEX IF NOT EXISTS idx_positions_user ON positions(user_id);

  CREATE TABLE IF NOT EXISTS p2p_payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_details TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS p2p_ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    merchant_name TEXT NOT NULL DEFAULT 'CoinTee',
    trades INTEGER NOT NULL DEFAULT 3442,
    completion_rate REAL NOT NULL DEFAULT 99.5,
    side TEXT NOT NULL CHECK (side IN ('BUY','SELL')),
    asset TEXT NOT NULL,
    fiat TEXT NOT NULL,
    price REAL NOT NULL,
    total_amount REAL NOT NULL,
    remaining_amount REAL NOT NULL,
    min_fiat REAL NOT NULL,
    max_fiat REAL NOT NULL,
    payment_window_min INTEGER NOT NULL DEFAULT 15,
    terms TEXT,
    status TEXT NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE','OFFLINE','CLOSED')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS p2p_ad_payment_methods (
    ad_id INTEGER NOT NULL REFERENCES p2p_ads(id) ON DELETE CASCADE,
    payment_method_id INTEGER NOT NULL REFERENCES p2p_payment_methods(id) ON DELETE CASCADE,
    PRIMARY KEY (ad_id, payment_method_id)
  );

  CREATE TABLE IF NOT EXISTS p2p_orders (
    id TEXT PRIMARY KEY,
    ad_id INTEGER NOT NULL REFERENCES p2p_ads(id),
    buyer_id INTEGER NOT NULL REFERENCES users(id),
    seller_id INTEGER NOT NULL REFERENCES users(id),
    asset TEXT NOT NULL,
    fiat TEXT NOT NULL,
    price REAL NOT NULL,
    crypto_amount REAL NOT NULL,
    fiat_amount REAL NOT NULL,
    payment_method_id INTEGER NOT NULL REFERENCES p2p_payment_methods(id),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PAID','COMPLETED','CANCELLED','EXPIRED','DISPUTED')),
    dispute_reason TEXT,
    expires_at TEXT NOT NULL,
    paid_at TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS p2p_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL REFERENCES p2p_orders(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

try { db.exec(`ALTER TABLE p2p_ads ADD COLUMN merchant_name TEXT NOT NULL DEFAULT 'CoinTee'`); } catch {}
try { db.exec(`ALTER TABLE p2p_ads ADD COLUMN trades INTEGER NOT NULL DEFAULT 3442`); } catch {}
try { db.exec(`ALTER TABLE p2p_ads ADD COLUMN completion_rate REAL NOT NULL DEFAULT 99.5`); } catch {}

