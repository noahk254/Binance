import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, type AuthedRequest } from '../middleware/auth';

const r = Router();

function seedDemoP2PIfNeeded() {
  try {
    const count = (db.prepare('SELECT COUNT(*) as c FROM p2p_ads').get() as { c: number }).c;
    const hasCoinTee = (db.prepare('SELECT COUNT(*) as c FROM p2p_ads WHERE merchant_name = ?').get('CoinTee') as { c: number }).c;
    if (count < 10 || hasCoinTee === 0) {
      db.prepare('DELETE FROM p2p_ad_payment_methods').run();
      db.prepare('DELETE FROM p2p_ads').run();
      db.prepare('DELETE FROM p2p_payment_methods').run();

      let merchant = db.prepare('SELECT id FROM users WHERE email = ?').get('merchant@binance.com') as { id: number } | undefined;
      let merchantId = merchant?.id;
      if (!merchantId) {
        const info = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run('merchant@binance.com', 'hashedpwd');
        merchantId = Number(info.lastInsertRowid);
      }

      const merchants = [
        { name: 'CoinTee', trades: 3442, rate: 99.64, price: 11445415.30, min: 1000, max: 250000, avail: 0.03175358, pms: ['M-PESA Kenya'] },
        { name: 'CryptoMerchantKE', trades: 301, rate: 99.59, price: 11335363.23, min: 10000, max: 100000, avail: 0.01477381, pms: ['M-PESA Kenya', 'Airtel Money', 'Bank Transfer'] },
        { name: 'SavannahTrader', trades: 1250, rate: 99.90, price: 11500000.00, min: 5000, max: 500000, avail: 0.05000000, pms: ['M-PESA Kenya', 'Bank Transfer'] },
        { name: 'AfriP2P', trades: 840, rate: 98.80, price: 11290000.00, min: 2000, max: 150000, avail: 0.02200000, pms: ['M-PESA Kenya', 'Airtel Money'] },
        { name: 'NairobiExpress', trades: 612, rate: 99.20, price: 11400000.00, min: 1000, max: 200000, avail: 0.04000000, pms: ['M-PESA Kenya'] },
        { name: 'MombasaCrypto', trades: 415, rate: 99.10, price: 11380000.00, min: 5000, max: 300000, avail: 0.01800000, pms: ['M-PESA Kenya', 'Bank Transfer'] },
        { name: 'RiftValleyDirect', trades: 930, rate: 99.75, price: 11460000.00, min: 2000, max: 400000, avail: 0.03500000, pms: ['M-PESA Kenya', 'Airtel Money'] },
        { name: 'AlphaP2P', trades: 1520, rate: 99.85, price: 11420000.00, min: 10000, max: 1000000, avail: 0.08000000, pms: ['M-PESA Kenya', 'Bank Transfer', 'Standard Chartered'] },
        { name: 'SwahiliTrade', trades: 210, rate: 98.50, price: 11350000.00, min: 500, max: 50000, avail: 0.01000000, pms: ['M-PESA Kenya'] },
        { name: 'ZambeziGlobal', trades: 789, rate: 99.30, price: 11480000.00, min: 5000, max: 500000, avail: 0.04500000, pms: ['M-PESA Kenya', 'Equity Bank'] },
      ];

      for (const m of merchants) {
        const adInfo = db.prepare(`
          INSERT INTO p2p_ads (
            user_id, merchant_name, trades, completion_rate,
            side, asset, fiat, price,
            total_amount, remaining_amount, min_fiat, max_fiat,
            payment_window_min, terms, status
          ) VALUES (
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?
          )
        `).run(
          merchantId, m.name, m.trades, m.rate,
          'SELL', 'BTC', 'KES', m.price,
          m.avail, m.avail, m.min, m.max,
          15, 'Fast and secure release.', 'ONLINE'
        );

        const adId = adInfo.lastInsertRowid;
        for (const pmType of m.pms) {
          const pmInfo = db.prepare('INSERT INTO p2p_payment_methods (user_id, type, account_name, account_details) VALUES (?, ?, ?, ?)').run(
            merchantId, pmType, `${m.name} ${pmType}`, '254700000000'
          );
          db.prepare('INSERT INTO p2p_ad_payment_methods (ad_id, payment_method_id) VALUES (?, ?)').run(adId, pmInfo.lastInsertRowid);
        }
      }
    }
  } catch (err) {
    console.error('P2P seeding error:', err);
  }
}

// GET /api/p2p/ads
r.get('/ads', (req, res) => {
  seedDemoP2PIfNeeded();
  const tab = (req.query.tab as string) || 'buy';
  const asset = (req.query.asset as string) || 'BTC';
  const fiat = (req.query.fiat as string) || 'KES';
  const side = tab === 'buy' ? 'SELL' : 'BUY';

  const ads = db.prepare(`
    SELECT a.id, a.side, a.asset, a.fiat, a.price,
           a.remaining_amount AS available,
           a.min_fiat AS min_limit,
           a.max_fiat AS max_limit,
           a.payment_window_min, a.terms,
           a.merchant_name AS nickname,
           a.trades AS orders,
           a.completion_rate
    FROM p2p_ads a
    WHERE a.asset = ? AND a.fiat = ? AND a.side = ? AND a.status = 'ONLINE' AND a.remaining_amount > 0
    ORDER BY a.price ${side === 'SELL' ? 'ASC' : 'DESC'}
  `).all(asset, fiat, side) as any[];

  const formatted = ads.map(ad => {
    const pms = db.prepare(`
      SELECT pm.type FROM p2p_ad_payment_methods apm
      JOIN p2p_payment_methods pm ON pm.id = apm.payment_method_id
      WHERE apm.ad_id = ?
    `).all(ad.id) as { type: string }[];
    return {
      ...ad,
      payments: pms.map(p => p.type),
    };
  });

  res.json(formatted);
});

// GET /api/p2p/payment-methods
r.get('/payment-methods', requireAuth, (req: AuthedRequest, res) => {
  seedDemoP2PIfNeeded();
  const userId = req.user!.id;
  const methods = db.prepare('SELECT * FROM p2p_payment_methods WHERE user_id = ?').all(userId);
  res.json(methods);
});

// POST /api/p2p/payment-methods
r.post('/payment-methods', requireAuth, (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const schema = z.object({
    type: z.string(),
    accountName: z.string(),
    accountDetails: z.string(),
  });
  const parsed = schema.parse(req.body);
  const info = db.prepare(`
    INSERT INTO p2p_payment_methods (user_id, type, account_name, account_details)
    VALUES (?, ?, ?, ?)
  `).run(userId, parsed.type, parsed.accountName, parsed.accountDetails);

  const created = db.prepare('SELECT * FROM p2p_payment_methods WHERE id = ?').get(info.lastInsertRowid);
  res.json(created);
});

// POST /api/p2p/ads
r.post('/ads', requireAuth, (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const schema = z.object({
    side: z.enum(['BUY', 'SELL']),
    asset: z.string(),
    fiat: z.string(),
    price: z.number().positive(),
    amount: z.number().positive(),
    minFiat: z.number().positive(),
    maxFiat: z.number().positive(),
    paymentMethodIds: z.array(z.number()).min(1),
    paymentWindowMin: z.number().default(15),
    terms: z.string().optional(),
    merchantName: z.string().default('Trader'),
  });
  const parsed = schema.parse(req.body);

  const adInfo = db.prepare(`
    INSERT INTO p2p_ads (
      user_id, merchant_name, trades, completion_rate,
      side, asset, fiat, price,
      total_amount, remaining_amount, min_fiat, max_fiat,
      payment_window_min, terms, status
    ) VALUES (
      ?, ?, 1, 100.0,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, 'ONLINE'
    )
  `).run(
    userId, parsed.merchantName,
    parsed.side, parsed.asset, parsed.fiat, parsed.price,
    parsed.amount, parsed.amount, parsed.minFiat, parsed.maxFiat,
    parsed.paymentWindowMin, parsed.terms ?? ''
  );

  const adId = adInfo.lastInsertRowid;
  const insertPm = db.prepare('INSERT INTO p2p_ad_payment_methods (ad_id, payment_method_id) VALUES (?, ?)');
  for (const pmId of parsed.paymentMethodIds) {
    insertPm.run(adId, pmId);
  }

  const created = db.prepare('SELECT * FROM p2p_ads WHERE id = ?').get(adId);
  res.json(created);
});

// GET /api/p2p/orders
r.get('/orders', requireAuth, (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const orders = db.prepare(`
    SELECT * FROM p2p_orders WHERE buyer_id = ? OR seller_id = ? ORDER BY created_at DESC
  `).all(userId, userId);
  res.json(orders);
});

// POST /api/p2p/orders
r.post('/orders', requireAuth, (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const schema = z.object({
    adId: z.number(),
    fiatAmount: z.number().positive(),
  });
  const parsed = schema.parse(req.body);

  const ad = db.prepare('SELECT * FROM p2p_ads WHERE id = ? AND status = \'ONLINE\'').get(parsed.adId) as any;
  if (!ad) {
    return res.status(404).json({ error: 'Ad not found or offline' });
  }

  const cryptoAmount = parsed.fiatAmount / ad.price;
  if (cryptoAmount > ad.remaining_amount) {
    return res.status(400).json({ error: 'Exceeds available amount in ad' });
  }

  const paymentMethod = db.prepare('SELECT * FROM p2p_payment_methods WHERE user_id = ?').get(ad.user_id) as any;
  const paymentMethodId = paymentMethod ? paymentMethod.id : 1;

  const orderId = 'P2P-' + Math.random().toString(36).substring(2, 11).toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO p2p_orders (id, ad_id, buyer_id, seller_id, asset, fiat, price, crypto_amount, fiat_amount, payment_method_id, status, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
  `).run(
    orderId, ad.id, userId, ad.user_id, ad.asset, ad.fiat, ad.price,
    cryptoAmount, parsed.fiatAmount, paymentMethodId, expiresAt
  );

  // Update ad remaining amount
  db.prepare('UPDATE p2p_ads SET remaining_amount = remaining_amount - ? WHERE id = ?').run(cryptoAmount, ad.id);

  const order = db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId);
  res.json(order);
});

// POST /api/p2p/orders/:id/paid
r.post('/orders/:id/paid', requireAuth, (req: AuthedRequest, res) => {
  const orderId = req.params.id;
  const order = db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId) as any;
  if (!order) return res.status(404).json({ error: 'Order not found' });

  db.prepare('UPDATE p2p_orders SET status = \'PAID\', paid_at = datetime(\'now\') WHERE id = ?').run(orderId);
  res.json(db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId));
});

// POST /api/p2p/orders/:id/release
r.post('/orders/:id/release', requireAuth, (req: AuthedRequest, res) => {
  const orderId = req.params.id;
  const order = db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId) as any;
  if (!order) return res.status(404).json({ error: 'Order not found' });

  db.prepare('UPDATE p2p_orders SET status = \'COMPLETED\', completed_at = datetime(\'now\') WHERE id = ?').run(orderId);

  // Credit buyer balance
  const buyerBalance = db.prepare('SELECT * FROM balances WHERE user_id = ? AND asset = ?').get(order.buyer_id, order.asset) as any;
  if (buyerBalance) {
    db.prepare('UPDATE balances SET free = free + ? WHERE user_id = ? AND asset = ?').run(order.crypto_amount, order.buyer_id, order.asset);
  } else {
    db.prepare('INSERT INTO balances (user_id, asset, free, locked) VALUES (?, ?, ?, 0)').run(order.buyer_id, order.asset, order.crypto_amount);
  }

  res.json(db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId));
});

// POST /api/p2p/orders/:id/cancel
r.post('/orders/:id/cancel', requireAuth, (req: AuthedRequest, res) => {
  const orderId = req.params.id;
  const order = db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId) as any;
  if (!order) return res.status(404).json({ error: 'Order not found' });

  db.prepare('UPDATE p2p_orders SET status = \'CANCELLED\' WHERE id = ?').run(orderId);
  // Return crypto to ad
  db.prepare('UPDATE p2p_ads SET remaining_amount = remaining_amount + ? WHERE id = ?').run(order.crypto_amount, order.ad_id);

  res.json(db.prepare('SELECT * FROM p2p_orders WHERE id = ?').get(orderId));
});

// Messages
r.get('/orders/:id/messages', requireAuth, (req: AuthedRequest, res) => {
  const orderId = req.params.id;
  const messages = db.prepare('SELECT * FROM p2p_messages WHERE order_id = ? ORDER BY created_at ASC').all(orderId);
  res.json(messages);
});

r.post('/orders/:id/messages', requireAuth, (req: AuthedRequest, res) => {
  const userId = req.user!.id;
  const orderId = req.params.id;
  const { text } = z.object({ text: z.string().min(1) }).parse(req.body);

  const info = db.prepare('INSERT INTO p2p_messages (order_id, sender_id, text) VALUES (?, ?, ?)').run(orderId, userId, text);
  const msg = db.prepare('SELECT * FROM p2p_messages WHERE id = ?').get(info.lastInsertRowid);
  res.json(msg);
});

export default r;
