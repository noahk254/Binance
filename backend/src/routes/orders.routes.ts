import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { HttpError } from '../utils/http-error';
import {
  placeSpotOrder,
  placeFuturesOrder,
  listOrders,
  cancelOrder,
} from '../services/matching.service';

export const ordersRouter = Router();
ordersRouter.use(requireAuth);

const spotOrderSchema = z.object({
  symbol: z.string().min(1).transform((s) => s.toUpperCase()),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['LIMIT', 'MARKET']),
  quantity: z.number().positive(),
  price: z.number().positive().optional(),
});

const futuresOrderSchema = spotOrderSchema.extend({
  leverage: z.number().int().min(1).max(125),
  reduceOnly: z.boolean().optional(),
});

/** POST /api/orders/spot — place a Spot order (fills immediately against live price). */
ordersRouter.post(
  '/spot',
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = spotOrderSchema.parse(req.body);
    const order = await placeSpotOrder({ userId: req.user!.id, ...input });
    res.status(201).json(order);
  }),
);

/** POST /api/orders/futures — place a Futures order; opens/adds-to/reduces/flips a position. */
ordersRouter.post(
  '/futures',
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = futuresOrderSchema.parse(req.body);
    const result = await placeFuturesOrder({ userId: req.user!.id, ...input });
    res.status(201).json(result);
  }),
);

/** GET /api/orders?market=SPOT|FUTURES — order history for the Open Orders tab. */
ordersRouter.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const market = req.query.market as 'SPOT' | 'FUTURES' | undefined;
    res.json(listOrders(req.user!.id, market));
  }),
);

/** DELETE /api/orders/:id — cancel a resting order. */
ordersRouter.delete(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid order id');
    res.json(cancelOrder(req.user!.id, id));
  }),
);
