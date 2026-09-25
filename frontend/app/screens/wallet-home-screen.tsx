"use client";

import { useState } from "react";
import { FeatureCard, SectionTitle, TokenMark } from "../components/feature-card";
import { Icon } from "../components/icons";

const TABS = ["Trending", "Stocks", "Perps", "Prediction"] as const;
const DATA = {
  Trending: [["PAID", "KSh3.05477", "-2.46%"], ["ZEC", "KSh200,714.87", "-1.37%"], ["PONS", "KSh83.28", "-5.26%"], ["GENIUS", "KSh44.03", "0.00%"]],
  Stocks: [["SNXX", "KSh2,302.68", "+16.74%"], ["MSTR", "KSh20,191.90", "+13.44%"], ["AEHR", "KSh11,350.59", "+12.59%"], ["LUNR", "KSh1,821.35", "+12.16%"], ["XLK", "KSh24,564.66", "+10.79%"]],
  Perps: [["BTCUSDT", "KSh10,523,697.67", "+3.84%"], ["ETHUSDT", "KSh341,852", "+5.03%"], ["XAUUSD1", "KSh567,437.7", "-0.08%"], ["SOLUSDT", "KSh14,470.15", "+5.08%"], ["ASTERUSDT", "KSh98.41", "+0.21%"]],
  Prediction: [["BTC Up", "58% chance", "+4.2%"], ["ETH Up", "54% chance", "+2.1%"], ["Gold Up", "51% chance", "+0.6%"]],
} as const;

export function WalletHomeScreen({ onExchange }: { onExchange?: () => void } = {}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Trending");
  const [filter, setFilter] = useState(0);
  const filters = tab === "Stocks" ? ["Rankings", "AI Discover", "Top Gainers", "Next Ea..."] : tab === "Prediction" ? ["Trending", "Crypto"] : ["All", "BSC", "Arc", "Robinhood", "Solan", "1h"];
  return <div className="space-y-5 p-4 pb-8">
    <div className="flex items-center justify-between"><Icon name="menu" /><div className="rounded-lg bg-surface p-1 text-sm"><button onClick={onExchange} className="px-3 text-muted">Exchange</button><span className="rounded-md bg-surface2 px-3 py-1.5 font-semibold text-text">Wallet</span></div><Icon name="support" /></div>
    <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3"><span className="text-muted">PAID Trends</span><Icon name="search" /></div>
    <FeatureCard className="bg-gradient-to-br from-[#2b3139] to-[#1e2329]"><p className="text-[25px] font-bold leading-tight text-text">Trade. Earn.<br />Explore <span className="text-yellow">On-Chain</span>.</p><button className="mt-4 rounded-lg bg-yellow px-4 py-2.5 text-sm font-bold text-onyellow">Set Up Wallet</button></FeatureCard>
    <div className="flex justify-between border-b border-line">{TABS.map((item) => <button key={item} onClick={() => { setTab(item); setFilter(0); }} className={`border-b-2 px-1 pb-3 text-sm ${tab === item ? "border-yellow text-text" : "border-transparent text-muted"}`}>{item}</button>)}</div>
    <SectionTitle action={<span className="text-sm text-muted">All tokens</span>}>{tab}</SectionTitle>
    <div className="-mx-1 flex gap-4 overflow-x-auto px-1">{filters.map((item, i) => <button key={item} onClick={() => setFilter(i)} className={`shrink-0 border-b-2 pb-2 text-sm ${filter === i ? "border-text text-text" : "border-transparent text-muted"}`}>{item}</button>)}</div>
    <div>{DATA[tab].map(([symbol, price, change], i) => <div key={symbol} className="flex items-center justify-between border-b border-line py-3.5"><div className="flex items-center gap-3"><TokenMark label={symbol} color={i === 1 ? "#2775CA" : "#FCD535"} /><span><b className="block text-text">{symbol}</b><small className="text-muted">On-chain market</small></span></div><span className="text-right"><b className="block text-text">{price}</b><small className={change.startsWith("-") ? "text-red" : "text-green"}>{change}</small></span></div>)}</div>
  </div>;
}
