import { db } from '../db';
import { config } from '../config';
import type { BalanceRow } from '../types';

/** Credits the demo starting balance to a brand-new user. Paper money only. */
export function seedBalances(userId: number) {
  const insert = db.prepare(
    `INSERT INTO balances (user_id, asset, free, locked) VALUES (?, ?, ?, 0)
     ON CONFLICT(user_id, asset) DO NOTHING`,
  );
  insert.run(userId, 'USDT', config.seedUsdt);
  insert.run(userId, 'BTC', config.seedBtc);
}

export function getBalances(userId: number): BalanceRow[] {
  return db.prepare(`SELECT * FROM balances WHERE user_id = ?`).all(userId) as BalanceRow[];
}

export function getBalance(userId: number, asset: string): BalanceRow {
  const row = db
    .prepare(`SELECT * FROM balances WHERE user_id = ? AND asset = ?`)
    .get(userId, asset) as BalanceRow | undefined;
  return row ?? { user_id: userId, asset, free: 0, locked: 0 };
}

/** Moves `amount` of `asset` between free and locked. Negative amounts subtract. */
export function adjustBalance(userId: number, asset: string, freeDelta: number, lockedDelta = 0) {
  db.prepare(
    `INSERT INTO balances (user_id, asset, free, locked) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, asset) DO UPDATE SET
       free = free + excluded.free,
       locked = locked + excluded.locked`,
  ).run(userId, asset, freeDelta, lockedDelta);
}

export function hasSufficientFree(userId: number, asset: string, amount: number): boolean {
  return getBalance(userId, asset).free >= amount;
}
