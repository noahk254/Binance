import express from 'express';
import cors from 'cors';
import http from 'node:http';
import { config } from './config';
import './db'; // applies schema on import
import { authRouter } from './routes/auth.routes';
import { marketsRouter } from './routes/markets.routes';
import { accountRouter } from './routes/account.routes';
import { ordersRouter } from './routes/orders.routes';
import { positionsRouter } from './routes/positions.routes';
import { errorHandler } from './middleware/error';
import { attachWebSocketServer } from './ws/server';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/markets', marketsRouter);
app.use('/api/account', accountRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/positions', positionsRouter);

// Must be registered last: Express only calls a 4-arg handler as an error handler.
app.use(errorHandler);

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(config.port, () => {
  console.log(`API + WS listening on http://localhost:${config.port}`);
  console.log(`WebSocket endpoint: ws://localhost:${config.port}/ws`);
});
