import { db } from '../db';
import { HttpError } from '../utils/http-error';
import { getLastPrice } from './binance.service';
import { adjustBalance, getBalance } from './account.service';
import type { Market, OrderRow, OrderSide, OrderType, PositionRow, PositionSide } from '../types';

/**
 * A deliberately simple paper-trading engine.
 *
 * Every order fills immediately against the current Binance last-traded
 * price (LIMIT orders only fill if that price already satisfies the limit,
 * MARKET orders always fill). There is no real order book matching, no
 * partial fills, and no queue — this is enough to make the UI's
 * balances/positions/order-history feel real without pretending to be an
 * exchange matching engine. Swap this out first if you ever need genuine
 * price-time-priority matching.
 */

const QUOTE_ASSET = 'USDT';

function baseAsset(symbol: string): string {
  // Every symbol we support is quoted in USDT (see binance.service.getExchangeSymbols).
  if (!symbol.endsWith(QUOTE_ASSET)) {
    throw new HttpError(400, `Only ${QUOTE_ASSET}-quoted symbols are supported`);
  }
  return symbol.slice(0, -QUOTE_ASSET.length);
}

function insertOrder(row: Omit<OrderRow, 'id' | 'created_at' | 'updated_at'>): OrderRow {
  const info = db
    .prepare(
      `INSERT INTO orders (user_id, market, symbol, side, type, price, quantity, filled_quantity, leverage, status, reduce_only)
       VALUES (@user_id, @market, @symbol, @side, @type, @price, @quantity, @filled_quantity, @leverage, @status, @reduce_only)`,
    )
    .run(row);
  return db.prepare(`SELECT * FROM orders WHERE id = ?`).get(info.lastInsertRowid) as OrderRow;
}

function markFilled(orderId: number, quantity: number) {
  db.prepare(
    `UPDATE orders SET status = 'FILLED', filled_quantity = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(quantity, orderId);
}

function limitWouldFill(side: OrderSide, limitPrice: number, marketPrice: number): boolean {
  return side === 'BUY' ? marketPrice <= limitPrice : marketPrice >= limitPrice;
}

/* ------------------------------------------------------------------ SPOT */

export interface PlaceSpotOrderInput {
  userId: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
}

export async function placeSpotOrder(input: PlaceSpotOrderInput): Promise<OrderRow> {
  const { userId, symbol, side, type, quantity } = input;
  if (quantity <= 0) throw new HttpError(400, 'quantity must be positive');
  if (type === 'LIMIT' && !input.price) throw new HttpError(400, 'price is required for LIMIT orders');

  const base = baseAsset(symbol);
  const marketPrice = await getLastPrice(symbol);
  const limitPrice = input.price ?? marketPrice;

  const willFillNow = type === 'MARKET' || limitWouldFill(side, limitPrice, marketPrice);
  const fillPrice = type === 'MARKET' ? marketPrice : limitPrice;
  const cost = fillPrice * quantity;

  // Funds check happens before we touch the ledger, so a rejected order never partially applies.
  if (side === 'BUY' && !(await sufficientFunds(userId, QUOTE_ASSET, cost))) {
    throw new HttpError(400, `Insufficient ${QUOTE_ASSET} balance`);
  }
  if (side === 'SELL' && !(await sufficientFunds(userId, base, quantity))) {
    throw new HttpError(400, `Insufficient ${base} balance`);
  }

  const order = insertOrder({
    user_id: userId,
    market: 'SPOT',
    symbol,
    side,
    type,
    price: type === 'LIMIT' ? limitPrice : null,
    quantity,
    filled_quantity: 0,
    leverage: null,
    status: 'OPEN', // flipped to FILLED just below once the ledger update succeeds
    reduce_only: 0,
  });

  if (!willFillNow) {
    // Resting limit order: this engine has no background matcher, so it just
    // sits as OPEN — accurate to what's persisted, but it will never fill on
    // its own even if the market price later crosses it. Cancel and resubmit,
    // or see the README for how to add a price-crossing sweep.
    return order;
  }

  if (side === 'BUY') {
    adjustBalance(userId, QUOTE_ASSET, -cost);
    adjustBalance(userId, base, quantity);
  } else {
    adjustBalance(userId, base, -quantity);
    adjustBalance(userId, QUOTE_ASSET, cost);
  }
  markFilled(order.id, quantity);

  return db.prepare(`SELECT * FROM orders WHERE id = ?`).get(order.id) as OrderRow;
}

async function sufficientFunds(userId: number, asset: string, amount: number): Promise<boolean> {
  return getBalance(userId, asset).free >= amount;
}

/* --------------------------------------------------------------- FUTURES */

export interface PlaceFuturesOrderInput {
  userId: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  leverage: number;
  reduceOnly?: boolean;
}

/**
 * BUY opens/adds-to LONG (or reduces SHORT); SELL opens/adds-to SHORT (or
 * reduces LONG) — the same convention Binance Futures uses. Margin is
 * quantity * entryPrice / leverage, held in USDT.
 */
export async function placeFuturesOrder(input: PlaceFuturesOrderInput): Promise<{ order: OrderRow; position: PositionRow | null }> {
  const { userId, symbol, side, type, quantity, leverage, reduceOnly = false } = input;
  if (quantity <= 0) throw new HttpError(400, 'quantity must be positive');
  if (leverage < 1 || leverage > 125) throw new HttpError(400, 'leverage must be between 1 and 125');
  if (type === 'LIMIT' && !input.price) throw new HttpError(400, 'price is required for LIMIT orders');

  const marketPrice = await getLastPrice(symbol);
  const limitPrice = input.price ?? marketPrice;
  const willFillNow = type === 'MARKET' || limitWouldFill(side, limitPrice, marketPrice);
  const fillPrice = type === 'MARKET' ? marketPrice : limitPrice;

  const order = insertOrder({
    user_id: userId,
    market: 'FUTURES',
    symbol,
    side,
    type,
    price: type === 'LIMIT' ? limitPrice : null,
    quantity,
    filled_quantity: 0,
    leverage,
    status: 'OPEN',
    reduce_only: reduceOnly ? 1 : 0,
  });

  if (!willFillNow) return { order, position: null };

  // Only an order that opens or adds to a position on its own side ties up new
  // margin. An order on the opposite side of an existing position is closing
  // it (fully or partially) and frees margin rather than requiring it, so the
  // upfront balance check only applies when there's nothing opposite to close.
  const opposingSide: PositionSide = side === 'BUY' ? 'SHORT' : 'LONG';
  const isClosingTrade = Boolean(getOpenPosition(userId, symbol, opposingSide));
  const requiredMargin = (fillPrice * quantity) / leverage;

  if (!isClosingTrade) {
    if (reduceOnly) {
      db.prepare(`UPDATE orders SET status = 'REJECTED', updated_at = datetime('now') WHERE id = ?`).run(order.id);
      throw new HttpError(400, 'reduceOnly order has no opposing position to reduce');
    }
    if (!(await sufficientFunds(userId, QUOTE_ASSET, requiredMargin))) {
      db.prepare(`UPDATE orders SET status = 'REJECTED', updated_at = datetime('now') WHERE id = ?`).run(order.id);
      throw new HttpError(400, 'Insufficient USDT margin');
    }
  }

  const position = applyFill(userId, symbol, side, quantity, fillPrice, leverage, requiredMargin);
  markFilled(order.id, quantity);

  return { order: db.prepare(`SELECT * FROM orders WHERE id = ?`).get(order.id) as OrderRow, position };
}

function getOpenPosition(userId: number, symbol: string, side: PositionSide): PositionRow | undefined {
  return db
    .prepare(`SELECT * FROM positions WHERE user_id = ? AND symbol = ? AND side = ?`)
    .get(userId, symbol, side) as PositionRow | undefined;
}

function applyFill(
  userId: number,
  symbol: string,
  side: OrderSide,
  quantity: number,
  fillPrice: number,
  leverage: number,
  margin: number,
): PositionRow {
  const openingSide: PositionSide = side === 'BUY' ? 'LONG' : 'SHORT';
  const opposingSide: PositionSide = side === 'BUY' ? 'SHORT' : 'LONG';

  const opposing = getOpenPosition(userId, symbol, opposingSide);
  if (opposing) {
    return reduceOrFlip(userId, opposing, quantity, fillPrice, leverage);
  }

  const existing = getOpenPosition(userId, symbol, openingSide);
  adjustBalance(userId, QUOTE_ASSET, -margin);

  if (!existing) {
    db.prepare(
      `INSERT INTO positions (user_id, symbol, side, quantity, entry_price, leverage, margin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(userId, symbol, openingSide, quantity, fillPrice, leverage, margin);
  } else {
    // Weighted-average the entry price across the combined size.
    const totalQty = existing.quantity + quantity;
    const avgEntry = (existing.entry_price * existing.quantity + fillPrice * quantity) / totalQty;
    db.prepare(
      `UPDATE positions SET quantity = ?, entry_price = ?, margin = margin + ?, updated_at = datetime('now')
       WHERE id = ?`,
    ).run(totalQty, avgEntry, margin, existing.id);
  }

  return getOpenPosition(userId, symbol, openingSide) as PositionRow;
}

/** An order on the opposite side of an existing position reduces it first, then flips if it overshoots. */
function reduceOrFlip(
  userId: number,
  opposing: PositionRow,
  quantity: number,
  fillPrice: number,
  leverage: number,
): PositionRow {
  const closingQty = Math.min(quantity, opposing.quantity);
  const pnl =
    opposing.side === 'LONG'
      ? (fillPrice - opposing.entry_price) * closingQty
      : (opposing.entry_price - fillPrice) * closingQty;

  const releasedMargin = (opposing.margin * closingQty) / opposing.quantity;
  adjustBalance(userId, QUOTE_ASSET, releasedMargin + pnl);

  const remainingQty = opposing.quantity - closingQty;
  if (remainingQty > 0) {
    db.prepare(
      `UPDATE positions SET quantity = ?, margin = margin - ?, updated_at = datetime('now') WHERE id = ?`,
    ).run(remainingQty, releasedMargin, opposing.id);
    return db.prepare(`SELECT * FROM positions WHERE id = ?`).get(opposing.id) as PositionRow;
  }

  db.prepare(`DELETE FROM positions WHERE id = ?`).run(opposing.id);

  const leftover = quantity - closingQty;
  if (leftover <= 0) {
    return { ...opposing, quantity: 0 };
  }

  // The order was larger than the position it closed: open a fresh position on the other side.
  const flippedSide: PositionSide = opposing.side === 'LONG' ? 'SHORT' : 'LONG';
  const newMargin = (fillPrice * leftover) / leverage;
  adjustBalance(userId, QUOTE_ASSET, -newMargin);
  db.prepare(
    `INSERT INTO positions (user_id, symbol, side, quantity, entry_price, leverage, margin)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(userId, opposing.symbol, flippedSide, leftover, fillPrice, leverage, newMargin);

  return getOpenPosition(userId, opposing.symbol, flippedSide) as PositionRow;
}

export function listOrders(userId: number, market?: Market): OrderRow[] {
  if (market) {
    return db
      .prepare(`SELECT * FROM orders WHERE user_id = ? AND market = ? ORDER BY created_at DESC`)
      .all(userId, market) as OrderRow[];
  }
  return db.prepare(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`).all(userId) as OrderRow[];
}

export function listPositions(userId: number): PositionRow[] {
  return db.prepare(`SELECT * FROM positions WHERE user_id = ? ORDER BY created_at DESC`).all(userId) as PositionRow[];
}

export function cancelOrder(userId: number, orderId: number): OrderRow {
  const order = db.prepare(`SELECT * FROM orders WHERE id = ? AND user_id = ?`).get(orderId, userId) as
    | OrderRow
    | undefined;
  if (!order) throw new HttpError(404, 'Order not found');
  if (order.status !== 'OPEN') throw new HttpError(400, `Cannot cancel an order with status ${order.status}`);

  db.prepare(`UPDATE orders SET status = 'CANCELED', updated_at = datetime('now') WHERE id = ?`).run(orderId);
  return db.prepare(`SELECT * FROM orders WHERE id = ?`).get(orderId) as OrderRow;
}
