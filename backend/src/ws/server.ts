import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'node:http';
import { config } from '../config';

/**
 * Bridges Binance's public combined-stream WebSocket to our own app clients.
 *
 * Clients connect to ws://<host>/ws and send { type: 'subscribe', symbol }.
 * We open (or reuse) one upstream Binance stream per symbol and fan its
 * messages out to every app client subscribed to that symbol. This keeps
 * the number of upstream connections small regardless of how many phones
 * are watching the same market, and means the client never needs Binance's
 * host or stream-naming conventions.
 */

interface ClientState {
  socket: WebSocket;
  symbols: Set<string>;
}

const clients = new Map<WebSocket, ClientState>();
const upstreams = new Map<string, WebSocket>(); // symbol (lowercase) -> upstream socket
const upstreamRefCount = new Map<string, number>();

function upstreamUrl(symbolLower: string): string {
  // depth20 = top-20 order book, updated every 100ms; ticker = 24h rolling stats.
  const streams = [`${symbolLower}@depth20@100ms`, `${symbolLower}@ticker`].join('/');
  return `${config.binanceWsBase}/stream?streams=${streams}`;
}

function ensureUpstream(symbolLower: string) {
  upstreamRefCount.set(symbolLower, (upstreamRefCount.get(symbolLower) ?? 0) + 1);
  if (upstreams.has(symbolLower)) return;

  const socket = new WebSocket(upstreamUrl(symbolLower));
  upstreams.set(symbolLower, socket);

  socket.on('message', (raw) => {
    const payload = raw.toString();
    for (const [clientSocket, state] of clients) {
      if (state.symbols.has(symbolLower) && clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(payload);
      }
    }
  });

  socket.on('close', () => upstreams.delete(symbolLower));
  socket.on('error', (err) => console.error(`Upstream Binance socket error (${symbolLower}):`, err.message));
}

function releaseUpstream(symbolLower: string) {
  const count = (upstreamRefCount.get(symbolLower) ?? 1) - 1;
  if (count <= 0) {
    upstreamRefCount.delete(symbolLower);
    upstreams.get(symbolLower)?.close();
    upstreams.delete(symbolLower);
  } else {
    upstreamRefCount.set(symbolLower, count);
  }
}

export function attachWebSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (socket) => {
    const state: ClientState = { socket, symbols: new Set() };
    clients.set(socket, state);

    socket.on('message', (raw) => {
      let msg: { type?: string; symbol?: string };
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return socket.send(JSON.stringify({ type: 'error', message: 'Malformed message; expected JSON' }));
      }

      if (msg.type === 'subscribe' && msg.symbol) {
        const symbolLower = msg.symbol.toLowerCase();
        // Guard against a repeated subscribe for a symbol this client already
        // has — otherwise the refcount goes up without a matching release.
        if (!state.symbols.has(symbolLower)) {
          state.symbols.add(symbolLower);
          ensureUpstream(symbolLower);
        }
        socket.send(JSON.stringify({ type: 'subscribed', symbol: msg.symbol.toUpperCase() }));
      } else if (msg.type === 'unsubscribe' && msg.symbol) {
        const symbolLower = msg.symbol.toLowerCase();
        if (state.symbols.delete(symbolLower)) releaseUpstream(symbolLower);
        socket.send(JSON.stringify({ type: 'unsubscribed', symbol: msg.symbol.toUpperCase() }));
      }
    });

    socket.on('close', () => {
      for (const symbolLower of state.symbols) releaseUpstream(symbolLower);
      clients.delete(socket);
    });
  });

  return wss;
}
