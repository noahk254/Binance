"use client";

import { Avatar } from "./avatar";
import { Tag } from "./tag";

export type Trader = { name: string; subscribers: string; tags: string[]; pnl: string; roi: string; assets: string; subscribeLabel?: string };
export function TraderCard({ trader }: { trader: Trader }) {
  return <article className="border-b border-line py-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><Avatar label={trader.name} size={44}/><span><b className="block text-[17px] text-text">{trader.name}</b><small className="text-muted">{trader.subscribers} Subscribers</small></span></div><button className="shrink-0 rounded-lg bg-yellow px-3 py-2 text-sm font-bold text-onyellow">{trader.subscribeLabel ?? "Subscribe"}</button></div><div className="mt-3 flex gap-2">{trader.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div><div className="mt-4 flex justify-between"><span><small className="block text-muted">30D PnL (USD)</small><b className="text-lg text-green">{trader.pnl}</b></span><span className="text-right"><small className="block text-muted">30D ROI</small><b className="text-green">{trader.roi}</b></span></div><div className="mt-3 flex items-end justify-between"><svg viewBox="0 0 150 45" className="h-12 w-40" aria-label="Performance trend"><path d="M2 38 L18 31 31 34 46 25 60 28 77 18 92 22 108 12 121 17 148 3" fill="none" stroke="#2EBD85" strokeWidth="2.5"/></svg><span className="text-right"><small className="block text-muted">Assets (USD)</small><b className="text-text">{trader.assets}</b></span></div></article>;
}
