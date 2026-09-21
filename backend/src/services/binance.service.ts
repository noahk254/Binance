import { config } from '../config';

// Uses Node's built-in global `fetch` (stable since Node 18) — deliberately
// no `node-fetch` dependency, since v3 of that package is ESM-only and
// breaks under this project's CommonJS build.

/**
 * Thin proxy over Binance's public market-data REST API. No API key is
 * needed for these endpoints — they're the same data anyone sees on
 * binance.com. We proxy rather than let the app call Binance directly so
 * the app only ever talks to one backend, and so we can cache/rate-limit
 * later without touching the client.
 */

export interface TickerSummary {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

export interface DepthLevel {
  price: string;
  quantity: string;
}

export interface DepthSnapshot {
  symbol: string;
  bids: DepthLevel[];
  asks: DepthLevel[];
  lastUpdateId: number;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Binance API ${res.status} for ${url}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export async function get24hTicker(symbol?: string): Promise<TickerSummary | TickerSummary[]> {
  const base = `${config.binanceRestBase}/api/v3/ticker/24hr`;
  const url = symbol ? `${base}?symbol=${encodeURIComponent(symbol)}` : base;
  return getJson(url);
}

export async function getDepth(symbol: string, limit = 10): Promise<DepthSnapshot> {
  const url = `${config.binanceRestBase}/api/v3/depth?symbol=${encodeURIComponent(symbol)}&limit=${limit}`;
  const raw = await getJson<{ lastUpdateId: number; bids: [string, string][]; asks: [string, string][] }>(url);
  return {
    symbol,
    lastUpdateId: raw.lastUpdateId,
    bids: raw.bids.map(([price, quantity]) => ({ price, quantity })),
    asks: raw.asks.map(([price, quantity]) => ({ price, quantity })),
  };
}

export async function getFuturesMarkPrice(symbol: string): Promise<{ symbol: string; markPrice: string }> {
  const url = `${config.binanceFapiBase}/fapi/v1/premiumIndex?symbol=${encodeURIComponent(symbol)}`;
  return getJson(url);
}

export async function getExchangeSymbols(limit = 60): Promise<string[]> {
  const url = `${config.binanceRestBase}/api/v3/exchangeInfo`;
  const raw = await getJson<{ symbols: { symbol: string; status: string; quoteAsset: string }[] }>(url);
  return raw.symbols
    .filter((s) => s.status === 'TRADING' && s.quoteAsset === 'USDT')
    .slice(0, limit)
    .map((s) => s.symbol);
}

/** Last-traded price only — used to value positions and fill market orders. */
export async function getLastPrice(symbol: string): Promise<number> {
  const url = `${config.binanceRestBase}/api/v3/ticker/price?symbol=${encodeURIComponent(symbol)}`;
  const raw = await getJson<{ price: string }>(url);
  return Number(raw.price);
}
