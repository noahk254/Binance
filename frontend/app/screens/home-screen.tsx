"use client";

import { useEffect, useState } from "react";
import { colors } from "../components/theme";
import { Icon, IconName } from "../components/icons";
import { WalletHomeScreen } from "./wallet-home-screen";
import { P2PScreen } from "./p2p-screen";
import { getBalances, depositFunds, type Balance } from "../lib/api";

const SHORTCUTS: { label: string; icon: IconName }[] = [
  { label: "Stocks", icon: "swap" },
  { label: "Earn", icon: "bag" },
  { label: "Traders League", icon: "gift" },
  { label: "Rewards Hub", icon: "gift" },
  { label: "More", icon: "more" },
];

export function HomeScreen() {
  const [wallet, setWallet] = useState("Exchange");
  const [balances, setBalances] = useState<Balance[]>([]);
  const [showAddFundsSheet, setShowAddFundsSheet] = useState(false);
  const [showP2PView, setShowP2PView] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("1000");
  const [depositAsset, setDepositAsset] = useState("USDT");
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

  if (showP2PView) {
    return <P2PScreen onBack={() => setShowP2PView(false)} />;
  }

  const totalUsdt = balances.reduce((acc, b) => {
    const val = b.free + b.locked;
    if (b.asset === "BTC") return acc + val * 85854.79;
    if (b.asset === "ETH") return acc + val * 2742.59;
    return acc + val;
  }, 0);

  const totalBtc = totalUsdt / 85854.79;

  const handleShortcutClick = (label: string) => {
    if (label === "Stocks" || label === "Earn" || label === "Traders League" || label === "Rewards Hub" || label === "More") {
      setShowAddFundsSheet(true);
    } else {
      alert(`${label} feature is connected to your Binance account.`);
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(depositAmount);
    if (!num || num <= 0) return alert("Enter valid amount");
    try {
      const res = await depositFunds(depositAsset, num, "Demo Deposit");
      setBalances(res.balances);
      setSuccessMsg(`Deposited ${num} ${depositAsset} successfully! 📧 Email sent.`);
      setTimeout(() => {
        setShowDepositModal(false);
        setShowAddFundsSheet(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Deposit failed");
    }
  };

  return (
    <div className="pb-24 relative min-h-dvh bg-[#0B0E11] text-[#EAECEF]">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#444,#111)] text-xs">
            🏆
          </div>
          <span className="text-[16px]">🎧</span>
        </div>

        <div className="flex rounded-[8px] bg-[#1E2026] p-0.5">
          {["Exchange", "Wallet"].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWallet(w)}
              className={`rounded-[6px] px-3.5 py-1.5 text-[13px] transition-colors ${
                wallet === w ? "bg-[#2B3139] text-white font-semibold" : "text-[#848E9C]"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-lg">
          <span>🏷️</span>
          <span className="relative">
            💬
            <span className="absolute -top-1.5 -right-2.5 bg-[#F0B90B] text-black text-[9px] font-bold rounded-full px-1">99+</span>
          </span>
        </div>
      </div>

      {/* Searchbar */}
      <div className="mx-4 my-2.5 bg-[#1E2026] rounded-lg px-3 py-2.5 flex items-center gap-2 text-[#848E9C] text-[13px]">
        <span>🔍</span>
        <span className="text-yellow font-bold mr-0.5">🔥</span>
        <span>QNT top gainer</span>
      </div>

      <div className="px-4">
        <div className="flex items-start justify-between mt-1.5">
          <div>
            <div className="flex items-center gap-1 text-[#848E9C] text-[13px]">
              Est. Total Value(BTC) <span className="text-xs">⌃</span>
            </div>
            <div className="text-[32px] font-bold text-white mt-1.5 tracking-wide">
              {totalBtc.toFixed(9)}
            </div>
            <div className="text-[#848E9C] text-[13px] mt-1">
              ≈KSh{(totalUsdt * 129.5).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[13px] text-[#848E9C] mt-1">
              Today&apos;s PNL <span className="text-[#0ECB81] font-semibold">+KSh142.50 (+0.56%)</span> ⌄
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddFundsSheet(true)}
            className="bg-[#F0B90B] text-black font-bold text-sm px-5 py-2.5 rounded-lg whitespace-nowrap shadow-md hover:opacity-95"
          >
            Add Funds
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex justify-between mt-5">
          {SHORTCUTS.map(({ label, icon }) => (
            <button key={label} type="button" onClick={() => handleShortcutClick(label)} className="flex flex-col items-center gap-2 w-[60px]">
              <div className="w-11 h-11 rounded-xl bg-[#1E2026] flex items-center justify-center text-lg transition-colors hover:bg-[#2B3139]">
                <Icon name={icon} size={22} color={colors.text} />
              </div>
              <span className="text-[11.5px] text-[#C9CDD3] text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Countdown Card / Trading Card */}
        <div className="mt-4 bg-[#1E2026] rounded-xl p-3.5">
          <div className="flex justify-between items-center text-[#848E9C] text-xs">
            <span>Trading Countdown</span>
            <span className="cursor-pointer">✕</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2.5">
              <div className="w-[30px] h-[30px] rounded-full bg-[#627EEA] text-white flex items-center justify-center text-base font-bold">
                Ξ
              </div>
              <span className="font-semibold text-white">ETHUSDT<span className="bg-[#2B3139] text-[#848E9C] text-[10px] px-1.5 py-0.5 rounded ml-1.5">Qtly</span></span>
            </div>
            <button onClick={() => setShowAddFundsSheet(true)} className="bg-[#2B3139] text-white text-xs px-5 py-2 rounded-lg font-semibold">
              Trade
            </button>
          </div>
          <div className="flex gap-1 justify-center mt-3.5">
            <span className="w-1 h-1 rounded-full bg-[#3A4048]"></span>
            <span className="w-3.5 h-1 rounded-full bg-[#5A6169]"></span>
            <span className="w-1 h-1 rounded-full bg-[#3A4048]"></span>
            <span className="w-1 h-1 rounded-full bg-[#3A4048]"></span>
          </div>
        </div>

        {/* Deposit & BNB row */}
        <div className="flex gap-3 mt-3.5">
          <div className="flex-1 bg-[#1E2026] rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 h-[150px]">
            <span className="text-[#848E9C] text-[13px]">Deposit</span>
            <span className="text-[#848E9C] text-[11px]">Click to View More</span>
            <button onClick={() => setShowDepositModal(true)} className="bg-[#2B3139] text-white text-xs px-6 py-2 rounded-lg font-semibold">
              Deposit
            </button>
          </div>
          <div className="flex-1 bg-[#1E2026] rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-[#F0B90B] text-black text-[11px] font-extrabold flex items-center justify-center">◈</span>
              <span className="font-bold text-white">BNB</span>
            </div>
            <div className="text-[19px] font-bold text-white">780.25</div>
            <div className="text-[#0ECB81] text-xs font-semibold mt-0.5">▲ 1.19%</div>
            <svg className="mt-2" width="100%" height="32" viewBox="0 0 140 32">
              <polyline points="0,22 15,18 30,20 45,12 60,15 75,8 90,12 105,6 120,10 140,2" fill="none" stroke="#0ECB81" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Feed tabs */}
        <div className="flex gap-5 border-t border-[#2B3139] mt-4 pt-3.5 text-sm text-[#848E9C]">
          <span className="text-white font-bold relative">
            Discover
            <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-[#F0B90B] rounded-full"></span>
          </span>
          <span>Following</span>
          <span>Stocks</span>
          <span>Campaigns ⌃</span>
        </div>
      </div>

      {/* Add Funds Bottom Sheet (Screen 1 from mockup) */}
      {showAddFundsSheet ? (
        <div className="absolute inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
          <div className="w-full bg-[#181A20] rounded-t-2xl p-5 shadow-2xl border-t border-[#2B3139] animate-in slide-in-from-bottom duration-200">
            <div className="w-9 h-1 bg-[#3A4048] rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">Add Funds</h2>
              <div className="flex items-center gap-1.5 bg-[#1E2026] px-2.5 py-1.5 rounded-2xl text-xs font-semibold">
                <span className="w-4 h-4 rounded-full bg-[#0ECB81] text-black font-extrabold text-[8px] flex items-center justify-center">KSh</span> KES ⌄
              </div>
            </div>

            <div
              onClick={() => {
                setShowAddFundsSheet(false);
                setShowP2PView(true);
              }}
              className="border border-[#2B3139] rounded-xl p-4 flex gap-3.5 items-start mb-3 bg-[#1E2026] cursor-pointer hover:border-yellow transition-colors"
            >
              <span className="text-xl mt-0.5">👥</span>
              <div>
                <div className="font-bold text-base text-white mb-0.5">P2P Trading</div>
                <div className="text-[#848E9C] text-xs leading-relaxed">Buy directly from users. Local payment (M-Pesa / Bank)</div>
              </div>
            </div>

            <div
              onClick={() => {
                setShowAddFundsSheet(false);
                setShowDepositModal(true);
              }}
              className="border border-[#2B3139] rounded-xl p-4 flex gap-3.5 items-start mb-3 bg-[#1E2026] cursor-pointer hover:border-yellow transition-colors"
            >
              <span className="text-xl mt-0.5">⬇️</span>
              <div>
                <div className="font-bold text-base text-white mb-0.5">Deposit Asset</div>
                <div className="text-[#848E9C] text-xs leading-relaxed">Deposit crypto from other exchanges/wallets to Binance</div>
              </div>
            </div>

            <div className="text-center text-[#848E9C] text-xs pt-1 cursor-pointer" onClick={() => setShowAddFundsSheet(false)}>
              Cancel ⌄
            </div>
          </div>
        </div>
      ) : null}

      {/* Deposit Modal */}
      {showDepositModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#181A20] p-6 shadow-2xl border border-[#2B3139]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B3139]">
              <h3 className="text-base font-bold text-white">Deposit Paper Crypto</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-muted hover:text-white">✕</button>
            </div>
            {successMsg ? (
              <div className="mt-5 rounded-xl bg-green/20 p-4 text-center text-xs font-semibold text-green">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleDepositSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1">Asset</label>
                  <select
                    value={depositAsset}
                    onChange={(e) => setDepositAsset(e.target.value)}
                    className="w-full rounded-xl bg-[#1E2026] p-3 text-white border border-[#2B3139] text-sm outline-none"
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Amount</label>
                  <input
                    type="number"
                    step="any"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-xl bg-[#1E2026] p-3 text-white border border-[#2B3139] text-sm font-semibold outline-none"
                    required
                  />
                </div>
                <button type="submit" className="w-full rounded-xl bg-yellow py-3.5 font-bold text-black text-sm">
                  Confirm Deposit
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
