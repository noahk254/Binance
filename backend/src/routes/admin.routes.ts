import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { adjustBalance, getBalance, getBalances } from '../services/account.service';

export const adminRouter = Router();

const adminSetBalanceSchema = z.object({
  userId: z.number().int().positive().optional(),
  asset: z.string().min(1).transform((s) => s.toUpperCase()),
  free: z.number().nonnegative(),
});

/**
 * POST /api/admin/set-balance
 * Admin / Owner override to set any user's balance to any amount in real-time.
 */
adminRouter.post(
  '/set-balance',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { userId, asset, free } = adminSetBalanceSchema.parse(req.body);
    const targetUserId = userId ?? req.user!.id;
    const current = getBalance(targetUserId, asset);
    const delta = free - current.free;
    adjustBalance(targetUserId, asset, delta, 0);
    console.log(`[ADMIN OVERRIDE]: User ${targetUserId} balance for ${asset} set to ${free} by user ${req.user!.id}`);
    res.json({
      success: true,
      message: `Admin override: User ${targetUserId} ${asset} balance set to ${free}`,
      balances: getBalances(targetUserId),
    });
  }),
);
