import { Router } from 'express';
import { asyncHandler } from '../middleware/error';
import * as binance from '../services/binance.service';

export const marketsRouter = Router();

/** GET /api/markets?limit=60 — USDT-quoted symbols with 24h stats, for the Markets grid. */
marketsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit ?? 60);
    const symbols = await binance.getExchangeSymbols(limit);
    const tickers = (await Promise.all(symbols.map((s) => binance.get24hTicker(s)))) as binance.TickerSummary[];
    res.json(
      tickers.map((t) => ({
        symbol: t.symbol,
        lastPrice: t.lastPrice,
        changePercent: t.priceChangePercent,
        high: t.highPrice,
        low: t.lowPrice,
        quoteVolume: t.quoteVolume,
      })),
    );
  }),
);

/** GET /api/markets/:symbol/ticker — single-symbol 24h summary, for a screen header. */
marketsRouter.get(
  '/:symbol/ticker',
  asyncHandler(async (req, res) => {
    const ticker = await binance.get24hTicker(req.params.symbol.toUpperCase());
    res.json(ticker);
  }),
);

/** GET /api/markets/:symbol/depth?limit=10 — order book snapshot for the Spot/Futures tickets. */
marketsRouter.get(
  '/:symbol/depth',
  asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit ?? 10);
    const depth = await binance.getDepth(req.params.symbol.toUpperCase(), limit);
    res.json(depth);
  }),
);

/** GET /api/markets/:symbol/mark-price — futures mark price + funding rate. */
marketsRouter.get(
  '/:symbol/mark-price',
  asyncHandler(async (req, res) => {
    const mark = await binance.getFuturesMarkPrice(req.params.symbol.toUpperCase());
    res.json(mark);
  }),
);
