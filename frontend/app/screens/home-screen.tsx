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
            <i className="fa-sharp fa-light fa-message-captions"></i>
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
        <div className="mt-4 bg-[#1E2026] rounded-xl p-3.5 border border-[#2B3139]">
          <div className="flex justify-between items-center text-[#848E9C] text-xs mb-2">
            <span>Trading Countdown</span>
            <span className="cursor-pointer">✕</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-[30px] h-[30px] rounded-full bg-[#FCD535] text-black flex items-center justify-center text-xs font-extrabold">
                S
              </div>
              <span className="font-bold text-white text-base">SECZUSDT</span>
            </div>
            <button onClick={() => setShowAddFundsSheet(true)} className="bg-[#2B3139] text-white text-xs px-5 py-2 rounded-lg font-semibold hover:bg-[#3A4048]">
              Trade
            </button>
          </div>
        </div>

        {/* Hot / TradFi / Alpha / New Tabs */}
        <div className="flex gap-5 border-t border-[#2B3139] mt-5 pt-4 text-base">
          <span className="text-white font-bold cursor-pointer">Hot</span>
          <span className="text-[#848E9C] cursor-pointer hover:text-white">TradFi</span>
          <span className="text-[#848E9C] cursor-pointer hover:text-white">Alpha</span>
          <span className="text-[#848E9C] cursor-pointer hover:text-white">New</span>
        </div>

        {/* Coin List */}
        <div className="mt-3 space-y-4 pb-4">
          {[
            { name: "BNB", price: "764.20", ksh: "99,132.02", change: "+0.12%", color: "#FCD535", letter: "◈" },
            { name: "BTC", price: "84,008.00", ksh: "10,897,517.76", change: "+1.17%", color: "#F7931A", letter: "₿" },
            { name: "ETH", price: "2,718.41", ksh: "352,632.15", change: "+2.12%", color: "#627EEA", letter: "Ξ" },
            { name: "SOL", price: "119.48", ksh: "15,498.95", change: "+0.66%", color: "#14F195", letter: "S" },
            { name: "DOGE", price: "0.09516", ksh: "12.34", change: "+2.07%", color: "#C2A633", letter: "Ð" },
          ].map((coin) => (
            <div key={coin.name} className="flex items-center justify-between py-1 border-b border-[#2B3139]/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: coin.color, color: coin.color === "#FCD535" || coin.color === "#14F195" ? "#000" : "#fff" }}>
                  {coin.letter}
                </div>
                <div>
                  <div className="text-white font-bold text-base">{coin.name}</div>
                  <div className="text-[#848E9C] text-xs">KSh {coin.ksh}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-base">{coin.price}</div>
                <div className="inline-block bg-[#2EBD85] text-white text-[11px] font-bold px-1.5 py-0.5 rounded mt-1">
                  {coin.change}
                </div>
              </div>
            </div>
          ))}
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
