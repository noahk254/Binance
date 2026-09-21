import { Router } from 'express';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { getBalances } from '../services/account.service';

export const accountRouter = Router();
accountRouter.use(requireAuth);

/** GET /api/account/balances — the Assets screen's balance list. */
accountRouter.get(
  '/balances',
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json(getBalances(req.user!.id));
  }),
);
