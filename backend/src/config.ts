import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required('JWT_SECRET', 'dev-secret-change-me'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  dbPath: process.env.DB_PATH ?? './data/app.db',
  seedUsdt: Number(process.env.SEED_USDT ?? 10000),
  seedBtc: Number(process.env.SEED_BTC ?? 0.05),
  binanceRestBase: process.env.BINANCE_REST_BASE ?? 'https://api.binance.com',
  binanceFapiBase: process.env.BINANCE_FAPI_BASE ?? 'https://fapi.binance.com',
  binanceWsBase: process.env.BINANCE_WS_BASE ?? 'wss://stream.binance.com:9443',
} as const;
