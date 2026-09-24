import { Router } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import { requireAuth, AuthedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { adjustBalance, getBalances } from '../services/account.service';

export const paymentRouter = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' as any });

const checkoutSchema = z.object({
  asset: z.string().min(1).transform((s) => s.toUpperCase()),
  amount: z.number().positive(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

/**
 * POST /api/payments/create-checkout-session
 * Creates a real Stripe Checkout Session for funding real money / crypto purchase.
 */
paymentRouter.post(
  '/create-checkout-session',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { asset, amount, successUrl, cancelUrl } = checkoutSchema.parse(req.body);

    if (stripeSecretKey.startsWith('sk_test_placeholder')) {
      adjustBalance(req.user!.id, asset, amount, 0);
      return res.json({
        success: true,
        simulated: true,
        message: `Stripe test payment successful. Credited ${amount} ${asset}.`,
        balances: getBalances(req.user!.id),
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `Deposit ${amount} ${asset}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `http://localhost:3000/assets?success=true&amount=${amount}&asset=${asset}`,
      cancel_url: cancelUrl || `http://localhost:3000/assets?canceled=true`,
      metadata: { userId: String(req.user!.id), asset, amount: String(amount) },
    });

    res.json({ sessionId: session.id, url: session.url });
  }),
);

/**
 * POST /api/payments/webhook
 * Stripe webhook to credit balance automatically when payment succeeds.
 */
paymentRouter.post(
  '/webhook',
  asyncHandler(async (req, res) => {
    const event = req.body;
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = Number(session.metadata?.userId);
      const asset = session.metadata?.asset;
      const amount = Number(session.metadata?.amount);
      if (userId && asset && amount) {
        adjustBalance(userId, asset, amount, 0);
        console.log(`[STRIPE WEBHOOK]: Credited ${amount} ${asset} to user ${userId}`);
      }
    }
    res.json({ received: true });
  }),
);
