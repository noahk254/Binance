import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { listPositions } from '../services/matching.service';
import { getLastPrice } from '../services/binance.service';

export const positionsRouter = Router();
positionsRouter.use(requireAuth);

/** GET /api/positions — open Futures positions with live mark-to-market PNL. */
positionsRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const positions = listPositions(req.user!.id);
    const withPnl = await Promise.all(
      positions.map(async (p) => {
        const markPrice = await getLastPrice(p.symbol);
        const pnl =
          p.side === 'LONG'
            ? (markPrice - p.entry_price) * p.quantity
            : (p.entry_price - markPrice) * p.quantity;
        const roi = (pnl / p.margin) * 100;
        return { ...p, markPrice, unrealizedPnl: pnl, roiPercent: roi };
      }),
    );
    res.json(withPnl);
  }),
);
