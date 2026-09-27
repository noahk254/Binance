"use client";

import { useState } from "react";

export function P2PScreen({ onBack }: { onBack?: () => void }) {
  const [buysell, setBuysell] = useState<"buy" | "sell">("buy");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [merchantName, setMerchantName] = useState("");
  const [merchantPrice, setMerchantPrice] = useState("");
  const [buyAmountKes, setBuyAmountKes] = useState("5000");
  const [successMessage, setSuccessMessage] = useState("");

  const handleBuyClick = (name: string, price: string) => {
    setMerchantName(name);
    setMerchantPrice(price);
    setShowCheckoutModal(true);
    setSuccessMessage("");
  };

  const confirmP2POrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(`Successfully placed P2P order with ${merchantName} for ${buyAmountKes} KES! Escrow locked. 📧 Email notification sent.`);
    setTimeout(() => {
      setShowCheckoutModal(false);
      setSuccessMessage("");
    }, 2500);
  };

  return (
    <div className="relative min-h-dvh bg-[#0B0E11] text-[#EAECEF] pb-24 font-sans text-sm">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2B3139]">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="text-xl text-white">←</button>
          <span className="text-muted">Express</span>
          <span className="text-white font-bold border-b-2 border-yellow pb-0.5">P2P</span>
          <span className="text-muted">Block Trade</span>
          <span className="text-muted">Lifestyle</span>
        </div>
      </div>

      {/* Banner Ad */}
      <div className="mx-4 my-3 rounded-2xl bg-black p-4 relative overflow-hidden border border-[#2B3139]">
        <span className="absolute top-3 right-4 text-xs text-muted cursor-pointer">✕</span>
        <div className="absolute right-3 top-6 w-[88px] h-[88px] rounded-full border-2 border-[#B8860B] opacity-60 pointer-events-none" />
        <div className="flex items-center gap-1.5 text-yellow font-extrabold text-[11px] tracking-wide mb-2">
          <span>◈</span> BINANCE
        </div>
        <h1 className="text-yellow text-[24px] font-extrabold leading-tight max-w-[210px]">
          BLOCK-ZONE<br />ZERO-FEE
        </h1>
        <p className="text-[#C9CDD3] text-[11px] mt-2 leading-relaxed">
          Trade Bigger, Pay Zero Fees<br />GHS, KES, XOF, XAF, UGX
        </p>
        <button className="mt-3 bg-yellow text-black text-[11px] font-extrabold px-3 py-1.5 rounded-xl">
          START TRADING
        </button>
      </div>

      <div className="flex justify-center gap-1 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3A4048]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9CDD3]"></span>
      </div>

      {/* Buy/Sell Pill & KES */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex bg-[#1E2026] rounded-full p-0.5 w-[140px]">
          <button
            onClick={() => setBuysell("buy")}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-full transition-colors ${buysell === "buy" ? "bg-[#EAECEF] text-black" : "text-muted"}`}
          >
            Buy
          </button>
          <button
            onClick={() => setBuysell("sell")}
            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-full transition-colors ${buysell === "sell" ? "bg-[#EAECEF] text-black" : "text-muted"}`}
          >
            Sell
          </button>
        </div>
        <div className="border border-[#2B3139] rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 bg-[#1E2026]">
          KES <span className="text-muted">⌄</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 px-4 py-2 text-xs text-[#EAECEF] overflow-x-auto">
        <span className="flex items-center gap-1 font-semibold text-yellow">₿ {selectedAsset} <span className="text-muted">⌄</span></span>
        <span className="flex items-center gap-1 text-muted">Amount <span className="text-muted">⌄</span></span>
        <span className="flex items-center gap-1 text-muted">Payment <span className="text-muted">⌄</span></span>
        <span className="flex items-center gap-1 text-muted ml-1"><span className="w-3.5 h-3.5 border border-[#5A6169] rounded-sm inline-block"></span>New</span>
        <span className="ml-auto text-muted">⚙️<span className="text-yellow">●</span></span>
      </div>

      <div className="px-4 pt-2 pb-1 text-sm font-bold text-text">Promoted Ad</div>

      {/* Ad Card 1: CoinTee */}
      <div className="mx-4 mb-3 border border-[#2B3139] rounded-2xl bg-[#181A20] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#EAECEF] text-black flex items-center justify-center font-bold text-xs relative">
              C
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green rounded-full border border-[#181A20]" />
            </div>
            <span className="font-bold text-sm text-white">CoinTee</span>
            <span className="w-4 h-4 rounded-full bg-[#7c4dff] text-white text-[9px] flex items-center justify-center">✓</span>
          </div>
          <span className="text-xs text-muted">15 min 🕐</span>
        </div>
        <div className="text-xs text-muted flex gap-2 items-center mb-3">
          <span className="underline decoration-dotted">Trade:</span> 3442 Trades (99.20%) | 👍 99.64%
        </div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <div className="text-xs text-muted mb-0.5">Price</div>
            <div className="text-xs text-muted">KSh <b className="text-lg text-white font-extrabold">11,445,415.30</b> /BTC</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-green block">M-PESA Kenya … ●</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-2 border-t border-[#2B3139]">
          <div className="text-xs text-muted leading-relaxed">
            Limit <b className="text-white">1,000 - 250,000 KES</b><br />
            Available <b className="text-white">0.03175358 BTC</b>
          </div>
          <button
            onClick={() => handleBuyClick("CoinTee", "11445415.30")}
            className="bg-[#0ECB81] text-[#0B0E11] font-bold text-xs px-6 py-2 rounded-lg"
          >
            Buy BTC
          </button>
        </div>
      </div>

      {/* Ad Card 2: CryptoMerchantKE */}
      <div className="mx-4 mb-3 border border-[#2B3139] rounded-2xl bg-[#181A20] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#EAECEF] text-black flex items-center justify-center font-bold text-xs relative">
              C
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green rounded-full border border-[#181A20]" />
            </div>
            <span className="font-bold text-sm text-white">CryptoMerchantKE</span>
            <span className="w-4 h-4 rounded-full bg-[#b06a2c] text-white text-[9px] flex items-center justify-center">🥇</span>
          </div>
          <span className="text-xs text-muted">15 min 🕐</span>
        </div>
        <div className="text-xs text-muted flex gap-2 items-center mb-3">
          <span className="underline decoration-dotted">Trade:</span> 301 Trades (100.00%) | 👍 99.59%
        </div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <div className="text-xs text-muted mb-0.5">Price</div>
            <div className="text-xs text-muted">KSh <b className="text-lg text-white font-extrabold">11,335,363.23</b> /BTC</div>
          </div>
          <div className="text-right text-xs text-muted leading-tight">
            <span className="text-green block">M-PESA Kenya … ●</span>
            <span className="text-red block">Airtel Money ●</span>
            <span className="text-red block">Bank Transfer ●</span>
          </div>
        </div>
        <div className="flex justify-between items-end pt-2 border-t border-[#2B3139]">
          <div className="text-xs text-muted leading-relaxed">
            Limit <b className="text-white">10,000 - 100,000 KES</b><br />
            Available <b className="text-white">0.01477381 BTC</b>
          </div>
          <button
            onClick={() => handleBuyClick("CryptoMerchantKE", "11335363.23")}
            className="bg-[#0ECB81] text-[#0B0E11] font-bold text-xs px-6 py-2 rounded-lg"
          >
            Buy BTC
          </button>
        </div>
      </div>

      {/* P2P Checkout Modal */}
      {showCheckoutModal ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#181A20] p-6 shadow-2xl border border-[#2B3139]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2B3139]">
              <h3 className="text-base font-bold text-white">Buy {selectedAsset} from {merchantName}</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-muted hover:text-white">✕</button>
            </div>
            {successMessage ? (
              <div className="mt-5 rounded-xl bg-green/20 p-4 text-center text-xs font-semibold text-green leading-relaxed">
                {successMessage}
              </div>
            ) : (
              <form onSubmit={confirmP2POrder} className="mt-4 space-y-4">
                <div className="text-xs text-muted">
                  Unit Price: <span className="text-yellow font-bold">KSh {merchantPrice}</span>
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">I want to pay (KES)</label>
                  <input
                    type="number"
                    value={buyAmountKes}
                    onChange={(e) => setBuyAmountKes(e.target.value)}
                    className="w-full rounded-xl bg-[#1E2026] p-3 text-white border border-[#2B3139] text-sm font-semibold outline-none"
                    required
                  />
                </div>
                <div className="rounded-xl bg-[#1E2026] p-3 text-xs text-muted space-y-1">
                  <div>Payment Method: <span className="text-white font-semibold">M-PESA Kenya</span></div>
                  <div>Estimated Receive: <span className="text-green font-semibold">{(Number(buyAmountKes) / Number(merchantPrice)).toFixed(8)} {selectedAsset}</span></div>
                </div>
                <button type="submit" className="w-full rounded-xl bg-[#0ECB81] py-3 font-bold text-black text-sm">
                  Confirm Purchase (P2P Escrow)
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
