"use client";

import { useState } from "react";
import { FeatureCard, SectionTitle, TokenMark } from "../components/feature-card";
import { Icon } from "../components/icons";

const TABS = ["Discover", "DeFi", "Booster", "DApps"];
const TOKENS = [["USDT", "11.00%", "#26A17B"], ["USDC", "171.14%", "#2775CA"], ["TRX", "0.30% - 23.10%", "#EB0029"], ["JST", "49.14%", "#D9021B"], ["SUN", "41.62%", "#F5A623"]] as const;

export function DiscoverScreen() {
  const [tab, setTab] = useState("Discover");
  return <div className="space-y-5 p-4 pb-8">
    <div className="flex gap-5 border-b border-line">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`border-b-2 pb-3 text-sm ${tab === t ? "border-yellow text-text" : "border-transparent text-muted"}`}>{t}</button>)}</div>
    <div className="flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm text-muted"><Icon name="search" size={18} />Search for dApps or enter a URL</div>
    <FeatureCard className="bg-gradient-to-r from-[#2A2711] to-[#30333a]"><p className="text-sm text-muted">Binance Wallet Earn</p><h1 className="mt-1 text-xl font-bold text-text">Subscribe USDC or PYUSD to share $300k rewards with...</h1><button className="mt-4 text-sm font-semibold text-yellow">Explore now →</button></FeatureCard>
    <div className="flex justify-center gap-1">{Array.from({ length: 8 }, (_, i) => <i key={i} className={`h-1 rounded-full ${i === 1 ? "w-3 bg-muted" : "w-1 bg-surface2"}`}/>)}</div>
    <SectionTitle action={<span className="text-muted">›</span>}>Recommended tokens</SectionTitle>
    <div className="grid grid-cols-2 gap-3">{TOKENS.slice(0, 2).map(([symbol, apy, color], i) => <FeatureCard key={symbol}><div className="flex items-center gap-2"><TokenMark label={symbol} color={color}/><b>{symbol}</b>{i ? <small className="rounded bg-[#413915] px-1 text-yellow">Bonus</small> : null}</div><p className="mt-5 text-xl font-bold text-yellow">{apy}</p><p className="text-sm text-muted">APY</p></FeatureCard>)}</div>
    <div>{TOKENS.slice(2).map(([symbol, apy, color]) => <div key={symbol} className="flex items-center justify-between border-b border-line py-4"><div className="flex items-center gap-3"><TokenMark label={symbol} color={color}/><b>{symbol}</b><small className="rounded bg-[#413915] px-1 text-yellow">Bonus</small></div><span className="text-yellow">{apy} <small className="text-muted">APY</small></span></div>)}</div>
    <SectionTitle action={<span className="text-muted">›</span>}>On-chain Opportunities</SectionTitle>
    <FeatureCard><div className="flex justify-between"><b className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface2">✦</b><span className="text-sm text-green">Ongoing</span></div><small className="mt-3 inline-block rounded bg-surface2 px-2 py-1 text-muted">🚀 Binance Wallet Exclusive</small><h3 className="mt-3 text-lg font-bold">Axis Robotics</h3><p className="mt-1 text-sm text-muted">The Compounding Data Engine Accelerating...</p><div className="mt-4 flex justify-between text-sm"><span className="text-muted">Rewards Pool</span><b>1,500,000 Axis Points</b></div><div className="mt-3 flex justify-between text-sm"><span className="text-muted">Ends in</span><b className="text-yellow">05d : 19h : 04m</b></div></FeatureCard>
  </div>;
}
