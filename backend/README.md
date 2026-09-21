# Binance app UI — backend

Paper-trading backend for the companion React Native frontend. Real market
data (prices, 24h stats, order books) is proxied from Binance's public API;
accounts, balances, orders and positions are simulated locally in SQLite. No
real money moves and no real orders reach Binance.

## Stack

- Node.js + Express + TypeScript
- SQLite via `better-sqlite3` (single file, zero setup)
- `ws` for a WebSocket bridge to Binance's public market-data stream
- `zod` for request validation, `jsonwebtoken` + `bcryptjs` for auth

## Setup

```bash
npm install
cp .env.example .env      # then edit JWT_SECRET before deploying anywhere real
npm run dev                # starts on http://localhost:4000, restarts on file changes
```

`npm run build && npm start` for a production run. `npm run typecheck` to
type-check without emitting.

The SQLite file is created automatically at `./data/app.db` on first boot.

## Auth

```
POST /api/auth/signup   { email, password }  -> { token, user }   (also seeds demo balances)
POST /api/auth/login    { email, password }  -> { token, user }
```

Every other route requires `Authorization: Bearer <token>`.

New accounts start with 10,000 USDT and 0.05 BTC (configurable via
`SEED_USDT` / `SEED_BTC` in `.env`) — enough paper money to place a few
orders without hitting insufficient-balance errors immediately.

## REST endpoints

```
GET  /api/markets?limit=60              USDT-quoted symbols + 24h stats  (Markets grid)
GET  /api/markets/:symbol/ticker        single-symbol 24h summary
GET  /api/markets/:symbol/depth?limit=10   order book snapshot           (Spot/Futures ticket)
GET  /api/markets/:symbol/mark-price    futures mark price + funding

GET  /api/account/balances              [{ asset, free, locked }]        (Assets screen)

POST /api/orders/spot                   { symbol, side, type, quantity, price? }
POST /api/orders/futures                { symbol, side, type, quantity, price?, leverage, reduceOnly? }
GET  /api/orders?market=SPOT|FUTURES    order history
DELETE /api/orders/:id                  cancel a resting (unfilled) order

GET  /api/positions                     open futures positions + live unrealized PNL
```

`side` is `BUY` or `SELL`; `type` is `LIMIT` or `MARKET`. `price` is required
for `LIMIT`, ignored for `MARKET`.

## WebSocket — live prices and order books

Connect to `ws://localhost:4000/ws`, then:

```json
{ "type": "subscribe", "symbol": "BTCUSDT" }
```

You'll start receiving Binance's raw combined-stream frames for that symbol
(`<symbol>@depth20@100ms` and `<symbol>@ticker`) verbatim — same shape as
Binance's own public WS API, just proxied through this server so the app
only needs one connection and never talks to Binance directly. Send
`{ "type": "unsubscribe", "symbol": "BTCUSDT" }` to stop. Multiple app
clients watching the same symbol share one upstream Binance connection.

## How the paper-trading engine works

This is deliberately not a real matching engine — there's no order book of
resting orders being crossed, no partial fills, no price-time priority. Each
order fills immediately against Binance's current last-traded price:

- **MARKET** orders always fill at that price.
- **LIMIT** orders fill immediately if the current price already satisfies
  the limit (e.g. a BUY limit at or above the market price); otherwise they
  are saved as `OPEN` and **will not fill later on their own** — there's no
  background sweep watching price against resting limits yet. Cancel and
  resubmit as the price moves, or see "extending it" below.
- **Futures** orders on the same side as an existing position add to it with
  a quantity-weighted average entry price. Orders on the opposite side close
  it first (realizing PNL into the USDT balance and releasing margin), and
  any leftover quantity beyond what closes the position opens a fresh
  position on the other side ("flip"), matching how Binance Futures behaves.
- Margin is `price * quantity / leverage`, held in USDT and checked against
  free balance *only* when an order would open or add to a position — an
  order that's closing an existing position doesn't need fresh margin.

See `src/services/matching.service.ts` — it's the one file worth reading
end to end before extending this.

## Known simplifications / where to extend next

- **No resting-limit fills**: add a `setInterval` sweep (or a queue worker)
  that re-checks each `OPEN` limit order against the latest price via
  `getLastPrice` and fills it when crossed, the same way `placeSpotOrder`
  already does for immediate fills.
- **No liquidations**: positions can show arbitrarily negative unrealized
  PNL past their margin without being force-closed. Add a check in
  `/api/positions` (or a periodic job) that closes a position once its loss
  exceeds its margin.
- **No funding-rate settlement**: `getFuturesMarkPrice` is exposed but
  nothing periodically applies funding to open positions.
- **No rate limiting or caching** on the Binance proxy routes — fine for one
  developer's phone, not for many concurrent users hitting `/api/markets`.
- **SQLite schema is applied directly on boot**, not through migrations —
  fine at this size; move to Drizzle or Knex before the schema changes often
  or ships to more than one environment.

## Project layout

```
src/
  index.ts                 Express app + HTTP server + WS attach
  config.ts                env var loading, one place to change defaults
  types.ts                 shared row/domain types
  db/index.ts               SQLite connection + schema
  middleware/
    auth.ts                 requireAuth — verifies the bearer token
    error.ts                 asyncHandler + centralized error responses
  services/
    binance.service.ts       proxy over Binance's public REST API
    account.service.ts       balance reads/writes, seeding new accounts
    matching.service.ts      the paper-trading engine (read this one)
  routes/
    auth.routes.ts  markets.routes.ts  account.routes.ts
    orders.routes.ts  positions.routes.ts
  ws/server.ts               Binance WS bridge with per-symbol connection sharing
  utils/
    jwt.ts  password.ts  http-error.ts
```

## Connecting the React Native frontend

In the frontend's `OrderBook` component, replace the `--` placeholders with
state from a WebSocket subscription:

```ts
const ws = new WebSocket('ws://<your-ip>:4000/ws');
ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', symbol: 'BTCUSDT' }));
ws.onmessage = (e) => {
  const { stream, data } = JSON.parse(e.data);
  if (stream.endsWith('@depth20@100ms')) { /* data.bids / data.asks */ }
  if (stream.endsWith('@ticker')) { /* data.c = last price, data.P = % change */ }
};
```

For the Buy/Long and Sell/Short buttons, `POST` to `/api/orders/spot` or
`/api/orders/futures` with the bearer token from login, then refresh
`/api/account/balances` and `/api/positions`.

On a physical device, `localhost` won't reach your dev machine — use your
machine's LAN IP (or `adb reverse tcp:4000 tcp:4000` for a plugged-in
Android device).
