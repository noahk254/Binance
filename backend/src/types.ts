export type Market = 'SPOT' | 'FUTURES';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET';
export type OrderStatus = 'OPEN' | 'FILLED' | 'CANCELED' | 'REJECTED';
export type PositionSide = 'LONG' | 'SHORT';

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

export interface BalanceRow {
  user_id: number;
  asset: string;
  free: number;
  locked: number;
}

export interface OrderRow {
  id: number;
  user_id: number;
  market: Market;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number | null;
  quantity: number;
  filled_quantity: number;
  leverage: number | null;
  status: OrderStatus;
  reduce_only: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface PositionRow {
  id: number;
  user_id: number;
  symbol: string;
  side: PositionSide;
  quantity: number;
  entry_price: number;
  leverage: number;
  margin: number;
  created_at: string;
  updated_at: string;
}

export interface AuthedRequestUser {
  id: number;
  email: string;
}
