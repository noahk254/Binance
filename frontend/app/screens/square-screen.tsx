"use client";

import { useEffect, useState } from "react";
import { PostCard } from "../components/post-card";
import { FeatureCard } from "../components/feature-card";

const FAKE_USERS = [
  { name: "CryptoWhale_88", action: "opened 75x LONG on BTC at $85,854", time: "Just now", profit: "+$14,230" },
  { name: "SatoshiQueen", action: "transferred 25,000 USDT from Spot to Futures", time: "1m ago", profit: "" },
  { name: "AlphaTrader99", action: "closed a SHORT on ETH with +340% ROI", time: "3m ago", profit: "+$8,950" },
  { name: "BinanceMaster", action: "deposited 100,000 USDT via M-Pesa / Credit Card", time: "5m ago", profit: "" },
  { name: "SolanaKing", action: "placed LIMIT BUY order for SOL at $144.70", time: "8m ago", profit: "" },
  { name: "BullRun2026", action: "saved 50,000 USDT in P2P escrow wallet", time: "12m ago", profit: "" },
];

const TABS = ["Discover", "Active Feed", "Stocks", "Campaign"];

function ActiveFeed() {
  const [feed, setFeed] = useState(FAKE_USERS);
  const [activeCount, setActiveCount] = useState(18492);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount((c) => c + Math.floor(Math.random() * 9) - 4);
      const randomUserNames = ["BitCoiner_X", "EthBull", "CryptoNinja", "TraderJoe", "MoonBoy", "WhaleAlert"];
      const randomActions = [
        "opened 50x LONG on BTC",
        "transferred funds to Futures",
        "withdrew profit to P2P",
        "placed MARKET order for SOL",
        "earned 12.5% APY in Binance Earn",
      ];
      const newUser = {
        name: randomUserNames[Math.floor(Math.random() * randomUserNames.length)],
        action: randomActions[Math.floor(Math.random() * randomActions.length)],
        time: "Just now",
        profit: `+$${(Math.random() * 5000).toFixed(2)}`,
      };
      setFeed((prev) => [newUser, ...prev.slice(0, 8)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4 pt-2">
      <div className="rounded-xl bg-surface p-4 border border-line flex items-center justify-between">
        <div>
          <b className="text-text flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green animate-pulse" />
            Live Active Traders
          </b>
          <small className="text-muted">Simulated active paper-trading community</small>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-yellow">{activeCount.toLocaleString()}</span>
          <small className="block text-muted">Traders Online</small>
        </div>
      </div>

      <div className="space-y-3">
        {feed.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-xl bg-surface p-3.5 border border-line">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-surface2 flex items-center justify-center font-bold text-xs text-yellow">{item.name[0]}</span>
                <b className="text-sm text-text">{item.name}</b>
                <span className="text-xs text-muted">{item.time}</span>
              </div>
              <p className="mt-1.5 text-xs text-muted pl-9">{item.action}</p>
            </div>
            {item.profit ? <span className="text-xs font-semibold text-green bg-green/10 px-2.5 py-1 rounded-lg">{item.profit}</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Discover() {
  return (
    <>
      <div className="flex gap-5 py-5">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface2 text-yellow">B</span>
          <small className="mt-2 block text-text">Binance Square</small>
        </div>
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted">•••</span>
          <small className="mt-2 block text-muted">Following</small>
        </div>
      </div>
      <p className="mb-1 font-semibold text-text">Popular ⌄</p>
      <PostCard author="Binance Square Official" verified time="Sep 17" counts="◯ 0   ↻ 3   ♡ 54   ↗">
        <h2 className="text-[17px] font-bold text-text">Michael Van De Poppe: Staying In The Game</h2>
        <div className="mt-3 flex min-h-40 rounded-xl bg-[#0B0E11] p-4">
          <div className="flex-1">
            <small className="text-muted">End 00:43:48</small>
            <p className="mt-3 text-xs tracking-widest text-muted">EPISODE 18</p>
            <b className="text-xl text-yellow">STAYING IN<br />THE GAME</b>
            <p className="mt-4 text-[11px] text-muted">📅 Sep 17, 2026<br />🕐 1:00pm UTC<br />📍 Live on Binance Square</p>
          </div>
          <div className="text-center">
            <small className="text-muted">◉ 5,190</small>
            <div className="mx-auto mt-5 h-20 w-20 rounded-full bg-surface2" />
            <small className="mt-2 block text-muted">MICHAEL VAN DE POPPE</small>
          </div>
        </div>
      </PostCard>
    </>
  );
}

function Stocks() {
  const headlines = ["AI Giants Face Collusion Allegations Over Calls to Slow Development", "Paramount, States May Settle Warner Bros. Deal Fight As Soon As This Weekend", "Saudi Arabia Seeks Rare Israeli Support as Hormuz Strait Is Effectively Blocked"];
  return (
    <>
      <FeatureCard className="mt-4">
        <div className="flex justify-between"><b>Market Highlights</b><small className="text-muted">Updated 2 mins ago</small></div>
        {headlines.map((item, i) => (
          <p key={item} className="mt-4 text-sm leading-5 text-text">
            <span className="mr-2 text-yellow">🌗{String(i + 1).padStart(2, "0")}</span>{item}
          </p>
        ))}
      </FeatureCard>
    </>
  );
}

function Campaign() {
  return (
    <FeatureCard className="relative mt-4 border border-yellow">
      <small className="absolute left-0 top-0 rounded-br-lg bg-yellow px-3 py-1 font-bold text-black">Hot</small>
      <div className="mt-7 flex justify-between">
        <span>
          <b className="text-2xl text-text">CreatorPad</b>
          <small className="mt-1 block text-muted">Unlock more rewards</small>
        </span>
        <span className="text-4xl">🎁</span>
      </div>
      {[["Project Campaigns", "0 ongoing events"], ["Project Leaderboard", "Participate, Rank & Earn Airdrop"]].map(([title, copy]) => (
        <div className="mt-4 rounded-xl bg-surface2 p-4" key={title}>
          <b className="text-text">{title}</b>
          <small className="mt-1 block text-muted">{copy}</small>
          <button className="mt-3 w-full rounded-lg bg-yellow py-2 font-bold text-black">JOIN</button>
        </div>
      ))}
    </FeatureCard>
  );
}

export function SquareScreen({ onBack }: { onBack?: () => void }) {
  const [tab, setTab] = useState("Active Feed");
  return (
    <div className="pb-8">
      <header className="flex items-center gap-3 px-4 py-4 border-b border-line">
        {onBack ? <button onClick={onBack} className="text-xl text-text" aria-label="Back">←</button> : null}
        <div className="flex flex-1 gap-5 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`shrink-0 border-b-2 pb-2 text-sm transition-colors ${
                tab === item ? "border-yellow text-text font-semibold" : "border-transparent text-muted"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="text-muted">⌕　◉</span>
      </header>
      <main className="px-4">
        {tab === "Active Feed" && <ActiveFeed />}
        {tab === "Discover" && <Discover />}
        {tab === "Stocks" && <Stocks />}
        {tab === "Campaign" && <Campaign />}
      </main>
    </div>
  );
}
