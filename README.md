# Binance-style trading interface

A full-stack Binance-inspired interface with a Next.js frontend and an
Express/TypeScript paper-trading API. Market data is read from Binance's public
endpoints; accounts, orders, balances, and positions are simulated locally.
No real trades or funds are involved.

## Project structure

```
frontend/  Next.js 16 web interface
backend/   Express API, SQLite paper-trading engine, and WebSocket bridge
```

The frontend includes the main exchange screens plus Wallet, Discover, Swap,
Square, Smart Money, and Settings experiences. Open the **Explore** button in
the lower-right corner of the app to view the additional screens.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Run locally

Open two terminals from the project root.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API starts at `http://localhost:4000`; the WebSocket endpoint is
`ws://localhost:4000/ws`.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Backend configuration

The backend uses safe development defaults, but set a strong `JWT_SECRET` in
`backend/.env` before deploying. Its SQLite database is created automatically
at `backend/data/app.db`.

Useful API endpoints include:

- `POST /api/auth/signup` and `POST /api/auth/login`
- `GET /api/markets`
- `GET /api/account/balances`
- `POST /api/orders/spot` and `POST /api/orders/futures`
- `GET /api/positions`

See [backend/README.md](backend/README.md) for the full API reference and
paper-trading behavior.

## Verification

```bash
cd frontend && npm run lint
cd frontend && npx next build --webpack
cd backend && npm run typecheck && npm run build
```

`--webpack` is useful in restricted environments where Turbopack cannot open
its internal worker port. In a normal local environment, `npm run build` also
works.
