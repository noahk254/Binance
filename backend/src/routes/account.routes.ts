import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { getBalances, getBalance, adjustBalance } from '../services/account.service';
import { HttpError } from '../utils/http-error';

export const accountRouter = Router();
accountRouter.use(requireAuth);

/** GET /api/account/balances — the Assets screen's balance list. */
accountRouter.get(
  '/balances',
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json(getBalances(req.user!.id));
  }),
);

const depositSchema = z.object({
  asset: z.string().min(1).transform((s) => s.toUpperCase()),
  amount: z.number().positive(),
  method: z.string().optional(),
});

/** POST /api/account/deposit — deposit funds via payment/card/crypto simulation. */
accountRouter.post(
  '/deposit',
  asyncHandler(async (req: AuthedRequest, res) => {
    const { asset, amount, method } = depositSchema.parse(req.body);
    adjustBalance(req.user!.id, asset, amount, 0);
    console.log(`[SIMULATED EMAIL NOTIFICATION]: Deposit of ${amount} ${asset} via ${method} credited to user ${req.user!.id}.`);
    res.json({
      success: true,
      asset,
      amount,
      method: method ?? 'Payment Gateway',
      emailNotificationSent: true,
      balances: getBalances(req.user!.id),
    });
  }),
);

const transferSchema = z.object({
  asset: z.string().min(1).transform((s) => s.toUpperCase()),
  amount: z.number().positive(),
  from: z.enum(['SPOT', 'FUTURES', 'FUNDING', 'P2P']),
  to: z.enum(['SPOT', 'FUTURES', 'FUNDING', 'P2P']),
});

/** POST /api/account/transfer — transfer funds between Spot, Futures, Funding, P2P */
accountRouter.post(
  '/transfer',
  asyncHandler(async (req: AuthedRequest, res) => {
    const { asset, amount, from, to } = transferSchema.parse(req.body);
    const balance = getBalance(req.user!.id, asset);
    if (balance.free < amount) {
      throw new HttpError(400, `Insufficient free ${asset} balance in ${from}`);
    }
    console.log(`[SIMULATED EMAIL NOTIFICATION]: Transfer of ${amount} ${asset} from ${from} to ${to} completed for user ${req.user!.id}.`);
    res.json({
      success: true,
      message: `Successfully transferred ${amount} ${asset} from ${from} to ${to}`,
      emailNotificationSent: true,
      balances: getBalances(req.user!.id),
    });
  }),
);

const setBalanceSchema = z.object({
  asset: z.string().min(1).transform((s) => s.toUpperCase()),
  free: z.number().nonnegative(),
});

/** POST /api/account/set-balance — edit demo balance to any custom amount */
accountRouter.post(
  '/set-balance',
  asyncHandler(async (req: AuthedRequest, res) => {
    const { asset, free } = setBalanceSchema.parse(req.body);
    const current = getBalance(req.user!.id, asset);
    const delta = free - current.free;
    adjustBalance(req.user!.id, asset, delta, 0);
    console.log(`[SIMULATED EMAIL NOTIFICATION]: Demo balance for ${asset} updated to ${free} for user ${req.user!.id}.`);
    res.json({
      success: true,
      message: `Demo balance for ${asset} updated to ${free}`,
      emailNotificationSent: true,
      balances: getBalances(req.user!.id),
    });
  }),
);
