export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");

export type MarketTicker = {
  symbol: string;
  lastPrice: string;
  changePercent: string;
  high: string;
  low: string;
  quoteVolume: string;
};

export type Balance = {
  user_id: number;
  asset: string;
  free: number;
  locked: number;
};

const defaultBalances: Balance[] = [
  { user_id: 1, asset: "USDT", free: 50000, locked: 0 },
  { user_id: 1, asset: "BTC", free: 0.15, locked: 0.01 },
  { user_id: 1, asset: "ETH", free: 2.5, locked: 0 },
  { user_id: 1, asset: "BNB", free: 12, locked: 0 },
  { user_id: 1, asset: "SOL", free: 45, locked: 0 },
  { user_id: 1, asset: "TRX", free: 2500, locked: 0 },
  { user_id: 1, asset: "FDUSD", free: 1000, locked: 0 },
];

const mockMarkets: MarketTicker[] = [
  { symbol: "BTCUSDT", lastPrice: "85854.79", changePercent: "+2.45", high: "87000.00", low: "84000.00", quoteVolume: "12450.50" },
  { symbol: "ETHUSDT", lastPrice: "2742.59", changePercent: "+1.80", high: "2800.00", low: "2650.00", quoteVolume: "8920.30" },
  { symbol: "SOLUSDT", lastPrice: "180.50", changePercent: "+5.12", high: "185.00", low: "172.00", quoteVolume: "15430.10" },
  { symbol: "TRXUSDT", lastPrice: "0.22", changePercent: "-0.45", high: "0.23", low: "0.21", quoteVolume: "45200.00" },
  { symbol: "BNBUSDT", lastPrice: "712.88", changePercent: "+0.95", high: "720.00", low: "705.00", quoteVolume: "3410.20" },
  { symbol: "FDUSDUSDT", lastPrice: "1.00", changePercent: "+0.01", high: "1.00", low: "1.00", quoteVolume: "98200.00" },
  { symbol: "XRPUSDT", lastPrice: "1.5028", changePercent: "-7.09", high: "1.6500", low: "1.4500", quoteVolume: "2000000.00" },
];

const mockP2PAds: P2PAd[] = [
  { id: 1, side: "SELL", asset: "BTC", fiat: "KES", price: 11445415.30, available: 0.03175358, min_limit: 1000, max_limit: 250000, payment_window_min: 15, terms: "Fast and secure release.", nickname: "CoinTee", orders: 3442, completion_rate: 99.64, payments: ["M-PESA Kenya"] },
  { id: 2, side: "SELL", asset: "BTC", fiat: "KES", price: 11335363.23, available: 0.01477381, min_limit: 10000, max_limit: 100000, payment_window_min: 15, terms: "Fast release.", nickname: "CryptoMerchantKE", orders: 301, completion_rate: 99.59, payments: ["M-PESA Kenya", "Airtel Money", "Bank Transfer"] },
  { id: 3, side: "SELL", asset: "BTC", fiat: "KES", price: 11500000.00, available: 0.05000000, min_limit: 5000, max_limit: 500000, payment_window_min: 15, terms: "Verified merchant.", nickname: "SavannahTrader", orders: 1250, completion_rate: 99.90, payments: ["M-PESA Kenya", "Bank Transfer"] },
  { id: 4, side: "SELL", asset: "BTC", fiat: "KES", price: 11290000.00, available: 0.02200000, min_limit: 2000, max_limit: 150000, payment_window_min: 15, terms: "Quick transfer.", nickname: "AfriP2P", orders: 840, completion_rate: 98.80, payments: ["M-PESA Kenya", "Airtel Money"] },
  { id: 5, side: "SELL", asset: "BTC", fiat: "KES", price: 11400000.00, available: 0.04000000, min_limit: 1000, max_limit: 200000, payment_window_min: 15, terms: "Instant release.", nickname: "NairobiExpress", orders: 612, completion_rate: 99.20, payments: ["M-PESA Kenya"] },
  { id: 6, side: "SELL", asset: "BTC", fiat: "KES", price: 11380000.00, available: 0.01800000, min_limit: 5000, max_limit: 300000, payment_window_min: 15, terms: "Reliable dealer.", nickname: "MombasaCrypto", orders: 415, completion_rate: 99.10, payments: ["M-PESA Kenya", "Bank Transfer"] },
  { id: 7, side: "SELL", asset: "BTC", fiat: "KES", price: 11460000.00, available: 0.03500000, min_limit: 2000, max_limit: 400000, payment_window_min: 15, terms: "Fast M-Pesa.", nickname: "RiftValleyDirect", orders: 930, completion_rate: 99.75, payments: ["M-PESA Kenya", "Airtel Money"] },
  { id: 8, side: "SELL", asset: "BTC", fiat: "KES", price: 11420000.00, available: 0.08000000, min_limit: 10000, max_limit: 1000000, payment_window_min: 15, terms: "Large volume welcome.", nickname: "AlphaP2P", orders: 1520, completion_rate: 99.85, payments: ["M-PESA Kenya", "Bank Transfer", "Standard Chartered"] },
  { id: 9, side: "SELL", asset: "BTC", fiat: "KES", price: 11350000.00, available: 0.01000000, min_limit: 500, max_limit: 50000, payment_window_min: 15, terms: "Micro trading.", nickname: "SwahiliTrade", orders: 210, completion_rate: 98.50, payments: ["M-PESA Kenya"] },
  { id: 10, side: "SELL", asset: "BTC", fiat: "KES", price: 11480000.00, available: 0.04500000, min_limit: 5000, max_limit: 500000, payment_window_min: 15, terms: "Secure escrow.", nickname: "ZambeziGlobal", orders: 789, completion_rate: 99.30, payments: ["M-PESA Kenya", "Equity Bank"] },
];

function getLocalBalances(): Balance[] {
  if (typeof window === "undefined") return defaultBalances;
  try {
    const raw = localStorage.getItem("binance_mock_balances");
    if (raw) {
      const parsed: Balance[] = JSON.parse(raw);
      const hasSol = parsed.some((b) => b.asset === "SOL");
      const hasTrx = parsed.some((b) => b.asset === "TRX");
      if (!hasSol || !hasTrx) {
        if (!hasSol) parsed.push({ user_id: 1, asset: "SOL", free: 45, locked: 0 });
        if (!hasTrx) parsed.push({ user_id: 1, asset: "TRX", free: 2500, locked: 0 });
        localStorage.setItem("binance_mock_balances", JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch {}
  saveLocalBalances(defaultBalances);
  return defaultBalances;
}

function saveLocalBalances(bals: Balance[]): Balance[] {
  if (typeof window !== "undefined") {
    localStorage.setItem("binance_mock_balances", JSON.stringify(bals));
  }
  return bals;
}

async function getAuthToken(forceRefresh = false): Promise<string> {
  if (typeof window === "undefined") return "";
  if (forceRefresh) {
    localStorage.removeItem("binance_token");
  }
  let token = localStorage.getItem("binance_token") ?? "";
  if (token && !forceRefresh) return token;

  const email = "demo@binance.com";
  const password = "demopassword123";
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      token = data.token ?? "";
      if (token) {
        localStorage.setItem("binance_token", token);
        return token;
      }
    }
  } catch {}

  try {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      token = data.token ?? "";
      if (token) {
        localStorage.setItem("binance_token", token);
        return token;
      }
    }
  } catch {}

  return "mock-token-vercel";
}

async function authedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    let token = await getAuthToken();
    let headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    let res = await fetch(url, { ...options, headers, cache: "no-store" });
    if (res.status === 401) {
      token = await getAuthToken(true);
      headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
      res = await fetch(url, { ...options, headers, cache: "no-store" });
    }
    return res;
  } catch (err) {
    throw err;
  }
}

export async function getMarkets(limit = 60): Promise<MarketTicker[]> {
  try {
    const response = await fetch(`${API_URL}/api/markets?limit=${limit}`, { cache: "no-store" });
    if (response.ok) {
      return response.json() as Promise<MarketTicker[]>;
    }
  } catch {}
  return mockMarkets;
}

export async function getTicker(symbol: string): Promise<MarketTicker> {
  try {
    const response = await fetch(`${API_URL}/api/markets/${symbol}/ticker`, { cache: "no-store" });
    if (response.ok) {
      return response.json() as Promise<MarketTicker>;
    }
  } catch {}
  return mockMarkets.find((m) => m.symbol === symbol) ?? mockMarkets[0];
}

export async function getBalances(): Promise<Balance[]> {
  try {
    const res = await authedFetch(`${API_URL}/api/account/balances`);
    if (res.ok) {
      return res.json() as Promise<Balance[]>;
    }
  } catch {}
  return getLocalBalances();
}

export async function depositFunds(asset: string, amount: number, method = "Credit Card / Payment"): Promise<{ balances: Balance[]; emailNotificationSent?: boolean }> {
  try {
    const res = await authedFetch(`${API_URL}/api/account/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset, amount, method }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}

  const bals = getLocalBalances();
  const existing = bals.find((b) => b.asset === asset);
  if (existing) {
    existing.free += amount;
  } else {
    bals.push({ user_id: 1, asset, free: amount, locked: 0 });
  }
  saveLocalBalances(bals);
  return { balances: bals, emailNotificationSent: true };
}

export async function transferFunds(asset: string, amount: number, from: string, to: string): Promise<{ balances: Balance[]; message: string; emailNotificationSent?: boolean }> {
  try {
    const res = await authedFetch(`${API_URL}/api/account/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset, amount, from, to }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}

  const bals = getLocalBalances();
  const existing = bals.find((b) => b.asset === asset);
  if (existing && existing.free >= amount) {
    existing.free -= amount;
  }
  saveLocalBalances(bals);
  return { balances: bals, message: `Successfully transferred ${amount} ${asset} from ${from} to ${to}`, emailNotificationSent: true };
}

export async function setCustomBalance(asset: string, free: number): Promise<{ balances: Balance[]; message: string; emailNotificationSent?: boolean }> {
  try {
    const res = await authedFetch(`${API_URL}/api/account/set-balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset, free }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}

  const bals = getLocalBalances();
  const existing = bals.find((b) => b.asset === asset);
  if (existing) {
    existing.free = free;
  } else {
    bals.push({ user_id: 1, asset, free, locked: 0 });
  }
  saveLocalBalances(bals);
  return { balances: bals, message: `Balance updated for ${asset}`, emailNotificationSent: true };
}

export async function createStripeCheckout(asset: string, amount: number): Promise<{ balances: Balance[]; url?: string; message?: string }> {
  try {
    const res = await authedFetch(`${API_URL}/api/payments/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset, amount }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}

  const bals = getLocalBalances();
  const existing = bals.find((b) => b.asset === asset);
  if (existing) {
    existing.free += amount;
  } else {
    bals.push({ user_id: 1, asset, free: amount, locked: 0 });
  }
  saveLocalBalances(bals);
  return { balances: bals, message: `Payment successful! Credited ${amount} ${asset}.` };
}

export async function adminSetBalance(asset: string, free: number): Promise<{ balances: Balance[]; message: string }> {
  try {
    const res = await authedFetch(`${API_URL}/api/admin/set-balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asset, free }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}

  const bals = getLocalBalances();
  const existing = bals.find((b) => b.asset === asset);
  if (existing) {
    existing.free = free;
  } else {
    bals.push({ user_id: 1, asset, free, locked: 0 });
  }
  saveLocalBalances(bals);
  return { balances: bals, message: `Admin Override: Balance for ${asset} set to ${free}` };
}

export async function placeFuturesOrderApi(data: {
  symbol: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET";
  quantity: number;
  price?: number;
  leverage: number;
  reduceOnly?: boolean;
}): Promise<Record<string, unknown>> {
  try {
    const res = await authedFetch(`${API_URL}/api/orders/futures`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}
  return { success: true, message: "Futures order placed successfully", orderId: Math.floor(Math.random() * 100000) };
}

export async function getPositionsApi(): Promise<Record<string, unknown>[]> {
  try {
    const res = await authedFetch(`${API_URL}/api/positions`);
    if (res.ok) {
      return res.json();
    }
  } catch {}
  return [];
}

export async function getOpenOrdersApi(market = "FUTURES"): Promise<Record<string, unknown>[]> {
  try {
    const res = await authedFetch(`${API_URL}/api/orders?market=${market}`);
    if (res.ok) {
      return res.json();
    }
  } catch {}
  return [];
}

export type P2PAd = {
  id: number;
  side: "BUY" | "SELL";
  asset: string;
  fiat: string;
  price: number;
  available: number;
  min_limit: number;
  max_limit: number;
  payment_window_min: number;
  terms: string;
  nickname: string;
  orders: number;
  completion_rate: number;
  payments: string[];
};

export async function getP2PAds(tab = "buy", asset = "BTC", fiat = "KES", payment = "All"): Promise<P2PAd[]> {
  try {
    let url = `${API_URL}/api/p2p/ads?tab=${tab}&asset=${asset}&fiat=${fiat}`;
    if (payment && payment !== "All") {
      url += `&payment=${encodeURIComponent(payment)}`;
    }
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      return res.json();
    }
  } catch {}
  return mockP2PAds.filter((ad) => ad.asset === asset && ad.fiat === fiat && (payment === "All" || ad.payments.includes(payment)));
}

export async function placeP2POrderApi(adId: number, fiatAmount: number): Promise<Record<string, unknown>> {
  try {
    const res = await authedFetch(`${API_URL}/api/p2p/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId, fiatAmount }),
    });
    if (res.ok) {
      return res.json();
    }
  } catch {}
  return {
    id: `P2P-${Math.floor(Math.random() * 1000000)}`,
    crypto_amount: fiatAmount / 11445415.30,
    status: "PENDING",
  };
}
