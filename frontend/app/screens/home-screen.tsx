"use client";

import { useState } from "react";
import { colors } from "../components/theme";
import { Skeleton } from "../components/skeleton";
import { Icon, IconName } from "../components/icons";
import { WalletHomeScreen } from "./wallet-home-screen";

const SHORTCUTS: { label: string; icon: IconName }[] = [
  { label: "Rewards Hub", icon: "ticket" },
  { label: "Referral", icon: "referral" },
  { label: "Earn", icon: "bag" },
  { label: "Deposit", icon: "deposit" },
  { label: "More", icon: "more" },
];

const FEED_TABS = ["Discover", "Following", "Hot", "Announcements"];

export function HomeScreen() {
  const [wallet, setWallet] = useState("Exchange");
  const [showBanner, setShowBanner] = useState(true);
  const [feedTab, setFeedTab] = useState("Discover");

  if (wallet === "Wallet") {
    return <WalletHomeScreen onExchange={() => setWallet("Exchange")} />;
  }

  return (
    <div className="pb-6">
      <div className="flex items-center justify-between px-4 pb-3.5 pt-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-marksurface">
            <span className="text-[17px]">🏆</span>
          </div>
          <Icon name="support" size={21} color={colors.muted} />
        </div>

        <div className="flex items-center rounded-[10px] bg-surface p-0.5">
          {["Exchange", "Wallet"].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWallet(w)}
              className={`rounded-[8px] px-5 py-2 text-[15px] font-semibold transition-colors ${
                wallet === w ? "bg-surface2 text-text" : "text-muted"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Icon name="gift" size={21} color={colors.muted} />
          <Icon name="chat" size={21} color={colors.muted} />
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between rounded-[10px] bg-surface px-3.5 py-2.5">
          <div className="flex items-center gap-2.5">
            <Icon name="search" size={19} color={colors.muted} />
            <span className="text-[14px] text-muted">🔥 ZEC hot search</span>
          </div>
          <Icon name="scan" size={19} color={colors.muted} />
        </div>

        <div className="mt-5 mb-2.5 flex items-center gap-1.5">
          <span className="text-[16px] text-text">Est. Total Value(BTC)</span>
          <Icon name="caretUp" size={16} color={colors.muted} strokeWidth={2.2} />
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <Skeleton className="h-[52px]" />
            <Skeleton className="mt-2 h-[22px] w-[55%]" delay={200} />
          </div>
          <button
            type="button"
            className="rounded-[10px] bg-yellow px-6 py-3.5 text-[16px] font-semibold text-onyellow transition-opacity hover:opacity-90"
          >
            Add Funds
          </button>
        </div>

        <div className="mt-3.5 flex items-center gap-1.5">
          <span className="border-b border-dotted border-dim text-[14px] text-muted">Today&apos;s PNL</span>
          <Icon name="caretDown" size={16} color={colors.muted} strokeWidth={2.2} />
        </div>

        <div className="mt-5 flex justify-between">
          {SHORTCUTS.map(({ label, icon }) => (
            <button key={label} type="button" className="flex w-[66px] flex-col items-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-surface transition-colors hover:bg-surface2">
                <Icon name={icon} size={24} color={colors.text} />
              </span>
              <span className="text-center text-[12.5px] text-text">{label}</span>
            </button>
          ))}
        </div>

        {showBanner ? (
          <div className="mt-5 rounded-[14px] bg-surface p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted">Trading Countdown</span>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="text-[15px] text-muted"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[1.5px] border-yellow bg-onyellow">
                  <span className="text-[9px] font-bold text-text">GoPro</span>
                </div>
                <div>
                  <p className="text-[16px] font-bold text-text">GPROB</p>
                  <p className="text-[13px] text-muted">GoPro (bStocks)</p>
                </div>
              </div>
              <button type="button" className="rounded-[8px] bg-surface2 px-5 py-2.5 text-[14px] text-text transition-colors hover:bg-[#353D46]">
                Trade
              </button>
            </div>

            <div className="mt-3.5 flex items-center justify-center gap-[5px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-[5px] rounded-full ${i === 0 ? "w-3.5 bg-muted" : "w-[5px] bg-surface2"}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-3.5 flex gap-3">
          <div className="flex min-h-[150px] flex-1 flex-col rounded-[14px] bg-surface p-3.5">
            <span className="text-[15px] text-muted">Deposit &amp; Withdraw</span>
            <button
              type="button"
              className="mx-auto my-auto flex items-center gap-2 rounded-[8px] bg-surface2 px-4 py-2.5 transition-colors hover:bg-[#353D46]"
            >
              <Icon name="refresh" size={17} color={colors.text} />
              <span className="text-[14px] text-text">Refresh</span>
            </button>
          </div>

          <div className="flex min-h-[150px] flex-1 flex-col rounded-[14px] bg-surface p-3.5">
            <div className="flex items-center gap-2">
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-yellow text-[11px] font-bold text-onyellow">
                ◈
              </span>
              <span className="text-[15px] text-muted">BNB</span>
            </div>
            <p className="mt-2.5 text-[24px] font-bold text-text">712.88</p>
            <p className="mt-0.5 text-[14px] text-red">▾ 0.84%</p>
            <svg viewBox="0 0 120 40" className="mt-auto h-11 w-full" aria-hidden>
              <path d="M6 30C26 30 44 26 62 14 76 5 96 3 114 3" fill="none" stroke="#3A4048" strokeWidth={3} strokeLinecap="round" />
              <rect x={22} y={30} width={16} height={8} rx={1} fill="#3A4048" />
              <rect x={48} y={26} width={16} height={12} rx={1} fill="#3A4048" />
              <rect x={74} y={18} width={16} height={20} rx={1} fill="#3A4048" />
              <rect x={100} y={10} width={16} height={28} rx={1} fill="#3A4048" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-[18px] flex items-center justify-between border-t border-line px-4 pb-2 pt-4">
        <div className="flex items-center gap-5">
          {FEED_TABS.map((t) => (
            <button key={t} type="button" onClick={() => setFeedTab(t)}>
              <span className={feedTab === t ? "text-[19px] text-text" : "text-[18px] font-semibold text-muted"}>{t}</span>
            </button>
          ))}
        </div>
        <Icon name="caretUp" size={16} color={colors.muted} strokeWidth={2.2} />
      </div>
      <div className="mx-4 rounded-[14px] bg-surface p-4">
        <p className="text-sm font-semibold text-text">{feedTab}</p>
        <p className="mt-2 text-sm leading-5 text-muted">
          {feedTab === "Discover" ? "Discover market stories, token launches, and opportunities." : feedTab === "Following" ? "Updates from traders and accounts you follow." : feedTab === "Hot" ? "The most discussed market moves right now." : "Official Binance announcements and product updates."}
        </p>
        <button type="button" className="mt-3 text-sm text-yellow">View all {feedTab} updates →</button>
      </div>
    </div>
  );
}
