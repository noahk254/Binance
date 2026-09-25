"use client";

import { useState } from "react";
import { TraderCard, type Trader } from "../components/trader-card";

const TABS = ["My Subscriptions", "Top Traders", "Smart Signal"];
const TRADERS: Trader[] = [
  { name: "TripleSs", subscribers: "22,780", tags: ["TripleS", "Private Positions"], pnl: "+5,110,865.90", roi: "+492.58%", assets: "5,898,836.56" },
  { name: "ESP bull", subscribers: "45,888", tags: ["$ESP 铁多", "Private Positions"], pnl: "+4,779,824.59", roi: "+32.95%", assets: "14,483,229.26" },
  { name: "Spin-zk", subscribers: "13", tags: ["Spinzk", "Private Positions"], pnl: "+4,434,752.70", roi: "+408.20%", assets: "0.00", subscribeLabel: "Subscribe with Code" },
];
export function SmartMoneyScreen({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState("Top Traders"); const [onlyAvailable, setOnlyAvailable] = useState(false);
  return <div className="p-4 pb-8"><header className="flex items-center gap-3"><button onClick={onBack} className="text-xl" aria-label="Back">←</button><h1 className="text-2xl font-bold">Smart Money</h1><span className="ml-auto text-muted">⌕　◉</span></header><div className="mt-5 flex gap-5 overflow-x-auto border-b border-line">{TABS.map((item) => <button onClick={() => setTab(item)} key={item} className={`shrink-0 border-b-2 pb-3 text-sm ${tab === item ? "border-yellow text-text" : "border-transparent text-muted"}`}>{item}</button>)}</div><div className="mt-4 flex items-center gap-2"><button className="rounded-lg bg-surface px-3 py-2 text-sm">30D ▾</button><button className="rounded-lg bg-surface px-3 py-2 text-sm">PnL ↑</button><span className="ml-auto text-muted">⌕　≡</span></div><label className="mt-4 block text-sm text-muted"><input className="mr-2 accent-yellow" type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />Only show copy available</label><div className="mt-2">{TRADERS.map((trader) => <TraderCard key={trader.name} trader={trader}/>)}</div></div>;
}
