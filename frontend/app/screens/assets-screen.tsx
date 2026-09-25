"use client";

import { useEffect, useState } from "react";
import { colors } from "../components/theme";
import { TopTabs } from "../components/top-tabs";
import { Icon, IconName } from "../components/icons";
import { getBalances, depositFunds, transferFunds, adminSetBalance, createStripeCheckout, type Balance } from "../lib/api";

const ASSET_META: Record<string, { name: string; color: string; glyph: string }> = {
  BTC: { name: "Bitcoin", color: "#F7931A", glyph: "₿" },
  USDT: { name: "TetherUS", color: "#26A17B", glyph: "◈" },
  FDUSD: { name: "First Digital USD", color: "#111418", glyph: "F" },
  ETH: { name: "Ethereum", color: "#627EEA", glyph: "Ξ" },
  BNB: { name: "Binance Coin", color: "#F3BA2F", glyph: "B" },
};

const ACTIONS: { label: string; icon: IconName }[] = [
  { label: "Add Funds", icon: "arrowDown" },
  { label: "Transfer", icon: "swap" },
  { label: "Admin Balance", icon: "history" },
  { label: "Earn", icon: "earn" },
];

export function AssetsScreen() {
  const [tab, setTab] = useState("Overview");
  const [hidden, setHidden] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Deposit form (Stripe / Real or Demo)
  const [depositAsset, setDepositAsset] = useState("USDT");
  const [depositAmount, setDepositAmount] = useState("1000");
  const [depositMode, setDepositMode] = useState<"stripe" | "demo">("stripe");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Transfer form
  const [transferAsset, setTransferAsset] = useState("USDT");
  const [transferAmount, setTransferAmount] = useState("1000");
  const [transferFrom, setTransferFrom] = useState("SPOT");
  const [transferTo, setTransferTo] = useState("FUTURES");

  // Admin form
  const [adminAsset, setAdminAsset] = useState("USDT");
  const [adminAmount, setAdminAmount] = useState("100000");

  const loadBalances = async () => {
    try {
      setLoading(true);
      const data = await getBalances();
      setBalances(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalances();
  }, []);

  const handleActionClick = (label: string) => {
    if (label === "Add Funds") {
      setShowDepositModal(true);
      setSuccessMsg("");
    } else if (label === "Transfer") {
      setShowTransferModal(true);
      setSuccessMsg("");
    } else if (label === "Admin Balance") {
      setShowAdminModal(true);
      setSuccessMsg("");
    } else {
      alert(`${label} feature is connected to your secure wallet.`);
    }
  };

  const submitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(depositAmount);
    if (!num || num <= 0) return alert("Enter valid amount");
    try {
      setSubmitting(true);
      if (depositMode === "stripe") {
        const res = await createStripeCheckout(depositAsset, num);
        if (res.url) {
          window.location.href = res.url;
          return;
        }
        if (res.balances) {
          setBalances(res.balances);
          setSuccessMsg(res.message || `Stripe payment successful! Credited ${num} ${depositAsset}. 📧 Email sent.`);
        }
      } else {
        const res = await depositFunds(depositAsset, num, "Demo Paper Deposit");
        setBalances(res.balances);
        setSuccessMsg(`Deposited ${num} ${depositAsset} (Demo). 📧 Email sent.`);
      }
      setTimeout(() => {
        setShowDepositModal(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Deposit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const submitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(transferAmount);
    if (!num || num <= 0) return alert("Enter valid amount");
    try {
      setSubmitting(true);
      const res = await transferFunds(transferAsset, num, transferFrom, transferTo);
      setBalances(res.balances);
      setSuccessMsg(`Transferred ${num} ${transferAsset} from ${transferFrom} to ${transferTo}! 📧 Email sent.`);
      setTimeout(() => {
        setShowTransferModal(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setSubmitting(false);
    }
  };

  const submitAdminBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(adminAmount);
    if (isNaN(num) || num < 0) return alert("Enter valid balance");
    try {
      setSubmitting(true);
      const res = await adminSetBalance(adminAsset, num);
      setBalances(res.balances);
      setSuccessMsg(`Admin Override: Balance for ${adminAsset} set to ${num}! 📧 Email sent.`);
      setTimeout(() => {
        setShowAdminModal(false);
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Admin set balance failed");
    } finally {
      setSubmitting(false);
    }
  };

  const visibleHoldings = balances.length
    ? balances.map((b) => {
        const meta = ASSET_META[b.asset] || { name: b.asset, color: "#333", glyph: b.asset[0] };
        const total = (b.free + b.locked).toFixed(8);
        return {
          symbol: b.asset,
          name: meta.name,
          amount: total,
          color: meta.color,
          glyph: meta.glyph,
        };
      })
    : [
        { symbol: "BTC", name: "Bitcoin", amount: "0.00000000", color: "#F7931A", glyph: "₿" },
        { symbol: "USDT", name: "TetherUS", amount: "0.00000000", color: "#26A17B", glyph: "◈" },
      ];

  const totalUsdt = balances.reduce((acc, b) => {
    const val = b.free + b.locked;
    if (b.asset === "BTC") return acc + val * 85854.79;
    if (b.asset === "ETH") return acc + val * 2742.59;
    if (b.asset === "BNB") return acc + val * 712.88;
    return acc + val;
  }, 0);

  const totalBtc = totalUsdt / 85854.79;

  return (
    <div className="pb-6">
      <TopTabs tabs={["Overview", "Funding", "Spot", "Futures"]} active={tab} onChange={setTab} />

      <div className="px-4 pt-[18px]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="text-[16px] text-text">Est. Total Value ({tab})</span>
            <button
              type="button"
              onClick={() => setHidden((h) => !h)}
              aria-label={hidden ? "Show balance" : "Hide balance"}
            >
              <Icon name="eye" size={17} color={colors.muted} />
            </button>
          </span>
          <button onClick={loadBalances} title="Refresh balances">
            <Icon name="history" color={colors.muted} />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-[34px] font-bold tracking-[2px] text-text">
            {hidden ? "▬▬" : totalBtc.toFixed(8)}
          </span>
          <button type="button" className="flex items-center gap-1.5">
            <span className="text-[22px] font-semibold text-text">BTC</span>
            <Icon name="caretDown" size={16} color={colors.text} strokeWidth={2.2} />
          </button>
        </div>
        <p className="mt-2.5 text-[16px] text-muted">≈ ${totalUsdt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Stripe & Demo)</p>

        <div className="mt-[18px] flex justify-between gap-3">
          {ACTIONS.map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleActionClick(label)}
              className="flex flex-1 flex-col items-center gap-2.5"
            >
              <span className="flex h-[66px] w-full items-center justify-center rounded-[12px] bg-surface transition-colors hover:bg-surface2">
                <Icon name={icon} size={25} color={colors.text} />
              </span>
              <span className="text-[13px] text-text">{label}</span>
            </button>
          ))}
        </div>

        {error ? <p className="mt-4 rounded-lg bg-surface p-3 text-sm text-red">{error}</p> : null}

        <div className="mt-[22px] rounded-[14px] bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[16px] text-muted">Balances ({tab}) {loading ? "(Syncing...)" : ""}</span>
            <button onClick={() => setShowAdminModal(true)} className="text-xs text-yellow">Admin Edit</button>
          </div>

          {visibleHoldings.map((h, i) => (
            <div key={h.symbol} className={`pt-[18px] ${i > 0 ? "mt-[18px] border-t border-line" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${
                      h.symbol === "FDUSD" ? "border border-line" : ""
                    }`}
                    style={{ backgroundColor: h.color }}
                  >
                    <span className="text-[16px] font-bold text-white">{h.glyph}</span>
                  </span>
                  <span>
                    <span className="block text-[17px] font-semibold text-text">{h.symbol}</span>
                    <span className="block text-[13.5px] text-muted">{h.name}</span>
                  </span>
                </div>
                <span className="text-right">
                  <span className="block text-[17px] font-medium text-text">{h.amount}</span>
                  <span className="block text-[13.5px] text-muted">{h.symbol}</span>
                </span>
              </div>
              <div className="mt-3.5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowTransferModal(true); setTransferAsset(h.symbol); }}
                  className="rounded-[8px] bg-surface2 px-4 py-2 text-[13px] text-text transition-colors hover:bg-[#353D46]"
                >
                  Transfer
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDepositModal(true); setDepositAsset(h.symbol); }}
                  className="rounded-[8px] bg-surface2 px-4 py-2 text-[13px] text-text transition-colors hover:bg-[#353D46]"
                >
                  Deposit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit & Stripe Payment Modal */}
      {showDepositModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-line">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <h3 className="text-lg font-bold text-text">Deposit (Stripe & Demo)</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-muted hover:text-text">✕</button>
            </div>
            {successMsg ? (
              <div className="mt-6 rounded-xl bg-green/20 p-4 text-center text-sm font-semibold text-green">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={submitDeposit} className="mt-4 space-y-4">
                <div className="flex gap-2 bg-surface2 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDepositMode("stripe")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg ${depositMode === "stripe" ? "bg-yellow text-black" : "text-muted"}`}
                  >
                    Stripe (Real / Test Card)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMode("demo")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg ${depositMode === "demo" ? "bg-yellow text-black" : "text-muted"}`}
                  >
                    Demo Deposit
                  </button>
                </div>

                <div>
                  <label className="block text-xs text-muted mb-1">Asset</label>
                  <select value={depositAsset} onChange={(e) => setDepositAsset(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Amount</label>
                  <input type="number" step="any" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line" required />
                </div>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-yellow py-3.5 font-bold text-black">
                  {submitting ? "Processing..." : depositMode === "stripe" ? `Pay with Stripe ($${depositAmount})` : `Deposit ${depositAmount} ${depositAsset}`}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* Transfer Modal */}
      {showTransferModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-line">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <h3 className="text-lg font-bold text-text">Internal Transfer (Spot ⇄ Futures ⇄ Funding ⇄ P2P)</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-muted hover:text-text">✕</button>
            </div>
            {successMsg ? (
              <div className="mt-6 rounded-xl bg-green/20 p-4 text-center text-sm font-semibold text-green">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={submitTransfer} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1">Asset</label>
                  <select value={transferAsset} onChange={(e) => setTransferAsset(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-muted mb-1">From</label>
                    <select value={transferFrom} onChange={(e) => setTransferFrom(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                      <option value="SPOT">Spot</option>
                      <option value="FUTURES">Futures</option>
                      <option value="FUNDING">Funding</option>
                      <option value="P2P">P2P</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">To</label>
                    <select value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                      <option value="SPOT">Spot</option>
                      <option value="FUTURES">Futures</option>
                      <option value="FUNDING">Funding</option>
                      <option value="P2P">P2P</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Amount</label>
                  <input type="number" step="any" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line" required />
                </div>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-yellow py-3.5 font-bold text-black">
                  {submitting ? "Transferring..." : "Confirm Transfer"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* Admin Balance Override Modal */}
      {showAdminModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-line">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <h3 className="text-lg font-bold text-text">Admin Balance Override</h3>
              <button onClick={() => setShowAdminModal(false)} className="text-muted hover:text-text">✕</button>
            </div>
            {successMsg ? (
              <div className="mt-6 rounded-xl bg-green/20 p-4 text-center text-sm font-semibold text-green">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={submitAdminBalance} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs text-muted mb-1">Asset</label>
                  <select value={adminAsset} onChange={(e) => setAdminAsset(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line">
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Override Balance To</label>
                  <input type="number" step="any" value={adminAmount} onChange={(e) => setAdminAmount(e.target.value)} className="w-full rounded-xl bg-surface2 p-3 text-text border border-line" required />
                </div>
                <p className="text-xs text-muted">Owner/Admin tool to instantly set any balance while trading live.</p>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-yellow py-3.5 font-bold text-black">
                  {submitting ? "Updating..." : "Apply Admin Balance Override"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
