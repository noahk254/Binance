"use client";

import { useEffect, useState } from "react";
import { colors } from "../components/theme";
import { TopTabs } from "../components/top-tabs";
import { Icon } from "../components/icons";
import { getTicker, getBalances, depositFunds, type MarketTicker, type Balance } from "../lib/api";

const MARGIN_TABS = ["USDⓈ-M", "COIN-M", "Options", "Smart"];

const CONTRACTS_USDM = [
  { symbol: "BTCUSDT", name: "Bitcoin", vol: "16.92B", price: "84,071.3", chg: -2.78, color: "#f7931a", glyph: "₿" },
  { symbol: "BNBUSDT", name: "BNB", vol: "521.22M", price: "772.48", chg: -2.56, color: "#f3ba2f", glyph: "◈" },
  { symbol: "ETHUSDT", name: "Ethereum", vol: "11.35B", price: "2,684.88", chg: -2.67, color: "#627eea", glyph: "◆" },
  { symbol: "BCHUSDT", name: "Bitcoin Cash", vol: "830.95M", price: "338.12", chg: -5.02, color: "#0ac18e", glyph: "₿" },
  { symbol: "XRPUSDT", name: "XRP", vol: "2.00B", price: "1.5028", chg: -7.09, color: "#23292f", glyph: "✕" },
];

export function FuturesScreen() {
  const [tab, setTab] = useState("USDⓈ-M");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [cross, setCross] = useState(true);
  const [lev, setLev] = useState(20);
  const [orderType, setOrderType] = useState<"Limit" | "Market">("Limit");
  const [price, setPrice] = useState("84907.0");
  const [amount, setAmount] = useState("");
  const [sliderVal, setSliderVal] = useState("0");
  const [activated, setActivated] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [ticker, setTicker] = useState<MarketTicker | null>(null);
  const [pair, setPair] = useState("BTC");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["BTCUSDT"]));

  const loadData = async () => {
    try {
      const bals = await getBalances();
      setBalances(bals);
      const tk = await getTicker(`${pair}USDT`);
      setTicker(tk);
      if (orderType === "Limit" && !price && tk) {
        setPrice(tk.lastPrice);
      }
    } catch {}
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [pair]);

  const usdtBal = balances.find((b) => b.asset === "USDT")?.free ?? 0;
  const btcBal = balances.find((b) => b.asset === "BTC")?.free ?? 0;
  const currentBal = tab === "COIN-M" ? btcBal : usdtBal;

  const handlePlaceOrder = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setSuccessMsg("Futures order placed successfully! 📧 Email notification sent.");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const filteredContracts = CONTRACTS_USDM.filter((c) => {
    if (searchQuery && !c.symbol.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pb-24 bg-[#0B0E11] text-[#EAECEF] relative min-h-dvh text-[14px]">
      {/* Margin Tabs */}
      <div className="flex items-center gap-[22px] px-4 py-3 text-[15px] text-[#848E9C] border-b border-[#2B3139]">
        {MARGIN_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-semibold transition-colors ${tab === t ? "text-white font-bold" : "text-[#848E9C]"}`}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-white cursor-pointer" onClick={() => alert("Menu")}>☰</span>
      </div>

      {/* New Listing Banner */}
      <div className="flex items-center gap-2 px-4 py-2.5 text-[12.5px] text-yellow border-b border-[#2B3139] bg-[#181A20]/50">
        <span>🚀</span>
        <span className="truncate">New Trading Pair: Binance Will List Hyperliquid (HYP…</span>
        <span className="ml-auto text-[#848E9C] cursor-pointer">✕</span>
      </div>

      {successMsg ? (
        <div className="m-3 rounded-lg bg-green/20 p-2.5 text-center text-xs font-semibold text-green">
          {successMsg}
        </div>
      ) : null}

      {tab === "USDⓈ-M" || tab === "COIN-M" ? (
        <div>
          {/* Pair Header Row */}
          <div className="flex justify-between items-center px-4 pt-3 pb-1">
            <button onClick={() => setShowPicker(true)} className="flex items-center gap-2 text-left">
              <span className="text-[18px] font-bold text-white flex items-center gap-2">
                {pair}USDT <span className="bg-[#1E2026] text-[#848E9C] text-[11px] px-2 py-0.5 rounded font-normal">Perp</span> ⌄
              </span>
            </button>
            <div className="flex gap-3.5 text-[#848E9C] text-sm items-center">
              <span>⇄</span>
              <span>⋯<span className="text-yellow text-xs">●</span></span>
            </div>
          </div>
          <div className="text-[#0ECB81] text-[13px] px-4 pb-2.5">+1.08%</div>

          {/* Trade Panel & Orderbook (matching mockup layout) */}
          <div className="flex px-4 gap-3.5">
            {/* Left Trade Form */}
            <div className="flex-1">
              <div className="flex bg-[#1E2026] rounded-lg p-0.5 mb-2.5">
                <button
                  onClick={() => setSide("buy")}
                  className={`flex-1 text-center py-2 rounded-md font-bold text-[14px] ${side === "buy" ? "bg-[#0ECB81] text-[#0B0E11]" : "text-[#848E9C]"}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSide("sell")}
                  className={`flex-1 text-center py-2 rounded-md font-bold text-[14px] ${side === "sell" ? "bg-[#F6465D] text-white" : "text-[#848E9C]"}`}
                >
                  Sell
                </button>
              </div>

              <div className="flex gap-2 mb-2.5">
                <div className="bg-[#1E2026] rounded-md py-1.5 flex-1 text-center text-[12.5px] text-[#EAECEF] font-medium">{cross ? "Cross" : "Isolated"}</div>
                <div className="bg-[#1E2026] rounded-md py-1.5 flex-1 text-center text-[12.5px] text-[#EAECEF] font-medium">{lev}x</div>
                <div className="bg-[#1E2026] rounded-md py-1.5 flex-1 text-center text-[12.5px] text-[#EAECEF] font-medium">M</div>
              </div>

              <div className="bg-[#1E2026] rounded-lg p-2.5 flex justify-between items-center mb-2.5 text-[13.5px]">
                <span>Limit ⓘ</span>
                <span className="text-[#848E9C]">⌄</span>
              </div>

              <div className="bg-[#1E2026] rounded-lg p-2.5 mb-2.5">
                <div className="text-[11.5px] text-[#848E9C] mb-1">Price (USDT)</div>
                <div className="flex justify-between items-center">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-transparent font-semibold text-[15px] w-full outline-none text-white"
                  />
                  <span className="bg-[#2B3139] text-[12.5px] px-3.5 py-1.5 rounded font-semibold text-white">BBO</span>
                </div>
              </div>

              <div className="bg-[#1E2026] rounded-lg p-2.5 mb-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11.5px] text-[#848E9C]">Amount</span>
                  <span className="text-[13px] text-[#848E9C]">BTC ⌄</span>
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent font-semibold text-[15px] w-full outline-none text-white mt-1"
                />
              </div>

              {/* Slider with diamonds */}
              <div className="flex items-center gap-1.5 my-3 px-0.5">
                <div className="w-2 h-2 rotate-45 border border-[#848E9C]" />
                <div className="flex-1 h-[1px] bg-[#3A4048] relative" />
                <div className="w-2 h-2 rotate-45 border border-[#848E9C]" />
                <div className="flex-1 h-[1px] bg-[#3A4048] relative" />
                <div className="w-2 h-2 rotate-45 border border-[#848E9C]" />
                <div className="flex-1 h-[1px] bg-[#3A4048] relative" />
                <div className="w-2 h-2 rotate-45 border border-[#848E9C]" />
                <div className="flex-1 h-[1px] bg-[#3A4048] relative" />
                <div className="w-2 h-2 rotate-45 border border-[#848E9C]" />
              </div>

              <div className="flex justify-between text-[12.5px] text-[#848E9C] mb-2">
                <span>Avbl</span>
                <span>{currentBal.toFixed(2)} USDT <span className="text-yellow font-bold">⊕</span></span>
              </div>

              <div className="bg-[#F0B90B]/12 text-yellow text-[12px] p-2.5 rounded-lg mb-2.5 flex justify-between items-center">
                <span>Add funds to trade Futures.</span>
                <span className="cursor-pointer">✕</span>
              </div>

              <div className="flex justify-between text-[12.5px] text-[#C9CDD3] mb-2">
                <label className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-[#1E2026]" /> TP/SL</label>
              </div>
              <div className="flex justify-between text-[12.5px] text-[#C9CDD3] mb-2">
                <label className="flex items-center gap-1.5"><input type="checkbox" className="rounded bg-[#1E2026]" /> Reduce Only</label>
                <span className="text-[#848E9C]">GTC ⌄</span>
              </div>

              <div className="flex justify-between text-[12.5px] text-[#848E9C] mb-1">
                <span>Max</span>
                <span className="text-[#EAECEF]">0.000 BTC</span>
              </div>
              <div className="flex justify-between text-[12.5px] text-[#848E9C] mb-2.5">
                <span>Cost</span>
                <span className="text-[#EAECEF]">0.00 USDT</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-[#0ECB81] text-[#0B0E11] text-center font-bold text-[15px] py-3 rounded-lg mt-1"
              >
                Buy / Long
              </button>
            </div>

            {/* Right Orderbook (width 128px exact matching mockup) */}
            <div className="w-[128px] text-[12px] select-none font-mono">
              <div className="flex justify-between text-[#848E9C] text-[10.5px] mb-1.5">
                <span>Price (USDT)</span>
                <span>Amount (BTC)</span>
              </div>
              <div className="flex justify-between py-[1.5px] text-[#F6465D]"><span>84,895.6</span><span>0.001</span></div>
              <div className="flex justify-between py-[1.5px] text-[#F6465D]"><span>84,895.3</span><span>0.001</span></div>
              <div className="flex justify-between py-[1.5px] text-[#F6465D]"><span>84,895.2</span><span>0.003</span></div>
              <div className="flex justify-between py-[1.5px] text-[#F6465D]"><span>84,895.1</span><span>0.003</span></div>
              <div className="flex justify-between py-[1.5px] text-[#F6465D]"><span>84,895.0</span><span>0.004</span></div>
              <div className="flex justify-between py-[1.5px] text-[#F6465D]"><span>84,894.9</span><span>2.051</span></div>

              <div className="text-center font-bold text-[15px] py-1.5 text-[#F6465D]">84,884.3</div>
              <div className="text-center text-[#848E9C] text-[11px] -mt-1 mb-0.5">84,896.5</div>

              <div className="flex justify-between py-[1.5px] text-[#0ECB81]"><span>84,894.8</span><span>7.452</span></div>
              <div className="flex justify-between py-[1.5px] text-[#0ECB81]"><span>84,894.7</span><span>0.366</span></div>
              <div className="flex justify-between py-[1.5px] text-[#0ECB81]"><span>84,894.6</span><span>0.003</span></div>
              <div className="flex justify-between py-[1.5px] text-[#0ECB81]"><span>84,894.5</span><span>0.024</span></div>
              <div className="flex justify-between py-[1.5px] text-[#0ECB81]"><span>84,894.3</span><span>0.002</span></div>
              <div className="flex justify-between py-[1.5px] text-[#0ECB81]"><span>84,894.1</span><span>0.059</span></div>

              <div className="flex items-center gap-1 mt-2 text-[10.5px]">
                <span className="text-[#0ECB81]">79.86%</span>
                <div className="flex-1 h-1 rounded bg-gradient-to-r from-[#0ECB81] to-[#F6465D]" />
                <span className="text-[#F6465D]">20.14%</span>
              </div>

              <div className="bg-[#1E2026] rounded-md mt-2 py-1.5 px-2.5 flex justify-between items-center text-xs">
                <span>0.1</span>
                <span>⌄ ▦</span>
              </div>
            </div>
          </div>

          {/* Positions / Orders Tab Bar */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-[#2B3139] mt-3 text-[13.5px] text-[#848E9C]">
            <span className="text-white font-bold border-b-2 border-yellow pb-2.5">Positions (0)</span>
            <span>Open Orders (0)</span>
            <span>Bots</span>
            <span>🕐</span>
          </div>

          <div className="px-4 py-2 text-[13px] text-[#848E9C] border-t border-[#2B3139] bg-[#0B0E11]">
            BTCUSDT Perp Chart ⌃
          </div>
        </div>
      ) : tab === "Options" ? (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Crypto Options Chain</h2>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Smart Money & Whale Flows</h2>
        </div>
      )}

      {/* Contract Picker Modal */}
      {showPicker ? (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowPicker(false)} />
          <div className="relative z-10 max-h-[85vh] rounded-t-2xl bg-[#0B0E11] border-t border-[#2B3139] flex flex-col p-4">
            <div className="mx-auto h-1 w-12 rounded-full bg-[#3A4048] mb-3" />
            <div className="flex items-center gap-3 bg-[#1E2026] rounded-xl px-3 py-2 mb-3">
              <Icon name="search" size={18} color={colors.muted} />
              <input
                type="text"
                placeholder="Search contracts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-white text-sm"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredContracts.map((c) => (
                <div
                  key={c.symbol}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1E2026] cursor-pointer"
                  onClick={() => {
                    setPair(c.symbol.replace("USDT", ""));
                    setShowPicker(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full font-bold text-white text-xs" style={{ backgroundColor: c.color }}>
                      {c.glyph}
                    </span>
                    <div>
                      <b className="text-white">{c.symbol}</b>
                      <small className="block text-[#848E9C]">{c.name}</small>
                    </div>
                  </div>
                  <div className="text-right">
                    <b className="text-white">{c.price}</b>
                    <span className={`block text-xs ${c.chg >= 0 ? "text-[#0ECB81]" : "text-[#F6465D]"}`}>{c.chg}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
