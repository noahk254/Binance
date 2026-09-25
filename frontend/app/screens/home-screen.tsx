"use client";

import { useEffect, useState } from "react";
import { colors } from "../components/theme";
import { Icon, IconName } from "../components/icons";
import { WalletHomeScreen } from "./wallet-home-screen";
import { getBalances, depositFunds, type Balance } from "../lib/api";

const SHORTCUTS: { label: string; icon: IconName }[] = [
  { label: "P2P", icon: "swap" },
  { label: "Deposit", icon: "deposit" },
  { label: "Referral", icon: "referral" },
  { label: "Earn", icon: "bag" },
  { label: "More", icon: "more" },
];

export function HomeScreen() {
  const [wallet, setWallet] = useState("Exchange");
  const [balances, setBalances] = useState<Balance[]>([]);
  const [showP2PModal, setShowP2PModal] = useState(false);
  const [p2pAsset, setP2pAsset] = useState("USDT");
  const [p2pAmount, setP2pAmount] = useState("1000");
  const [p2pFiat, setP2pFiat] = useState("KSh (M-Pesa)");
  const [successMsg, setSuccessMsg] = useState("");

  const loadBalances = async () => {
    try {
      const data = await getBalances();
      setBalances(data);
    } catch {}
  };

  useEffect(() => {
    loadBalances();
  }, []);

  if (wallet === "Wallet") {
    return <WalletHomeScreen onExchange={() => setWallet("Exchange")} />;
  }

  const totalUsdt = balances.reduce((acc, b) => {
    const val = b.free + b.locked;
    if (b.asset === "BTC") return acc + val * 85854.79;
    if (b.asset === "ETH") return acc + val * 2742.59;
    return acc + val;
  }, 0);

  const totalBtc = totalUsdt / 85854.79;

  const handleShortcutClick = (label: string) => {
    if (label === "P2P") {
      setShowP2PModal(true);
      setSuccessMsg("");
    } else if (label === "Deposit") {
      setShowP2PModal(true);
      setSuccessMsg("");
    } else {
      alert(`${label} feature is connected to your Binance account.`);
    }
  };

  const executeP2PTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(p2pAmount);
    if (!num || num <= 0) return alert("Enter valid amount");
    try {
      const res = await depositFunds(p2pAsset, num, `P2P Express (${p2pFiat})`);
      setBalances(res.balances);
      setSuccessMsg(`P2P Order Successful! Credited ${num} ${p2pAsset}. 📧 Email sent.`);
      setTimeout(() => {
        setShowP2PModal(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "P2P trade failed");
    }
  };

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
            <span className="text-[14px] text-muted">🔥 BTC / USDT Hot Search</span>
          </div>
          <Icon name="scan" size={19} color={colors.muted} />
        </div>

        <div className="mt-5 mb-2.5 flex items-center gap-1.5">
          <span className="text-[16px] text-text">Est. Total Value (BTC)</span>
          <Icon name="caretUp" size={16} color={colors.muted} strokeWidth={2.2} />
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h2 className="text-[32px] font-bold text-text">{totalBtc.toFixed(8)} BTC</h2>
            <p className="mt-1 text-sm text-muted">≈ ${totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowP2PModal(true)}
            className="rounded-[10px] bg-yellow px-6 py-3.5 text-[16px] font-semibold text-onyellow transition-opacity hover:opacity-90"
          >
            P2P / Deposit
          </button>
        </div>

        <div className="mt-3.5 flex items-center gap-1.5">
          <span className="border-b border-dotted border-dim text-[14px] text-muted">Today&apos;s PNL</span>
          <span className="text-sm font-semibold text-green">+$142.50 (+1.84%)</span>
        </div>

        <div className="mt-5 flex justify-between">
          {SHORTCUTS.map(({ label, icon }) => (
            <button key={label} type="button" onClick={() => handleShortcutClick(label)} className="flex w-[66px] flex-col items-center gap-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-surface transition-colors hover:bg-surface2">
                <Icon name={icon} size={24} color={colors.text} />
              </span>
              <span className="text-center text-[12.5px] text-text">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* P2P Trading Modal */}
      {showP2PModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-line">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <h3 className="text-lg font-bold text-text">Binance P2P Express</h3>
              <button onClick={() => setShowP2PModal(false)} className="text-muted hover:text-text">✕</button>
            </div>
            {successMsg ? (
              <div className="mt-6 rounded-xl bg-green/20 p-4 text-center text-sm font-semibold text-green">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={executeP2PTrade} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1">Crypto Asset</label>
                  <select value={p2pAsset} onChange={(e) => setP2pAsset(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                    <option value="USDT">USDT (Tether)</option>
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Amount</label>
                  <input type="number" step="any" value={p2pAmount} onChange={(e) => setP2pAmount(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line" required />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Payment Method / Fiat</label>
                  <select value={p2pFiat} onChange={(e) => setP2pFiat(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                    <option value="KSh (M-Pesa)">M-Pesa / Mobile Money (KSh)</option>
                    <option value="USD (Bank Transfer)">Bank Transfer (USD/EUR)</option>
                    <option value="Credit/Debit Card">Credit / Debit Card</option>
                  </select>
                </div>
                <button type="submit" className="w-full rounded-xl bg-yellow py-3.5 font-bold text-black">
                  Buy {p2pAsset} via P2P Escrow
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
