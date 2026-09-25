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

async function getAuthToken(): Promise<string> {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem("binance_token") ?? "";
  if (token) return token;

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

  return "";
}

export async function getMarkets(limit = 60): Promise<MarketTicker[]> {
  const response = await fetch(`${API_URL}/api/markets?limit=${limit}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Market request failed (${response.status})`);
  return response.json() as Promise<MarketTicker[]>;
}

export async function getTicker(symbol: string): Promise<MarketTicker> {
  const response = await fetch(`${API_URL}/api/markets/${symbol}/ticker`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Ticker request failed (${response.status})`);
  return response.json() as Promise<MarketTicker>;
}

export async function getBalances(): Promise<Balance[]> {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/api/account/balances`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to load balances (${res.status})`);
  return res.json() as Promise<Balance[]>;
}

export async function depositFunds(asset: string, amount: number, method = "Credit Card / Payment"): Promise<{ balances: Balance[]; emailNotificationSent?: boolean }> {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/api/account/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ asset, amount, method }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Deposit failed (${res.status})`);
  }
  return res.json();
}

export async function transferFunds(asset: string, amount: number, from: string, to: string): Promise<{ balances: Balance[]; message: string; emailNotificationSent?: boolean }> {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/api/account/transfer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ asset, amount, from, to }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Transfer failed (${res.status})`);
  }
  return res.json();
}

export async function setCustomBalance(asset: string, free: number): Promise<{ balances: Balance[]; message: string; emailNotificationSent?: boolean }> {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/api/account/set-balance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ asset, free }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Set balance failed (${res.status})`);
  }
  return res.json();
}

export async function createStripeCheckout(asset: string, amount: number): Promise<{ balances: Balance[]; url?: string; message?: string }> {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ asset, amount }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Stripe checkout failed (${res.status})`);
  }
  return res.json();
}

export async function adminSetBalance(asset: string, free: number): Promise<{ balances: Balance[]; message: string }> {
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/api/admin/set-balance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ asset, free }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Admin set balance failed (${res.status})`);
  }
  return res.json();
}
