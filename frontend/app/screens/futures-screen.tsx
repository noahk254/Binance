"use client";

import { useEffect, useState } from "react";
import { colors } from "../components/theme";
import { TopTabs } from "../components/top-tabs";
import { Icon } from "../components/icons";
import { getTicker, getBalances, depositFunds, type MarketTicker, type Balance } from "../lib/api";

const MARGIN_TABS = ["USDⓈ-M", "COIN-M", "Options", "Smart Money"];

const CONTRACTS_USDM = [
  { symbol: "BTCUSDT", name: "Bitcoin", vol: "16.92B", price: "84,071.3", chg: -2.78, color: "#f7931a", glyph: "₿" },
  { symbol: "BNBUSDT", name: "BNB", vol: "521.22M", price: "772.48", chg: -2.56, color: "#f3ba2f", glyph: "◈" },
  { symbol: "ETHUSDT", name: "Ethereum", vol: "11.35B", price: "2,684.88", chg: -2.67, color: "#627eea", glyph: "◆" },
  { symbol: "BCHUSDT", name: "Bitcoin Cash", vol: "830.95M", price: "338.12", chg: -5.02, color: "#0ac18e", glyph: "₿" },
  { symbol: "XRPUSDT", name: "XRP", vol: "2.00B", price: "1.5028", chg: -7.09, color: "#23292f", glyph: "✕" },
  { symbol: "LTCUSDT", name: "Litecoin", vol: "370.70M", price: "67.44", chg: 5.34, color: "#9a9a9a", glyph: "Ł" },
  { symbol: "TRXUSDT", name: "TRON", vol: "57.52M", price: "0.34311", chg: -0.2, color: "#eb0029", glyph: "▽" },
  { symbol: "ETCUSDT", name: "Ethereum Classic", vol: "95.21M", price: "9.235", chg: -3.25, color: "#2f9e44", glyph: "◆" },
];

export function FuturesScreen() {
  const [tab, setTab] = useState("USDⓈ-M");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [cross, setCross] = useState(true);
  const [lev, setLev] = useState(20);
  const [orderType, setOrderType] = useState<"Limit" | "Market">("Limit");
  const [price, setPrice] = useState("84083");
  const [amount, setAmount] = useState("");
  const [sliderVal, setSliderVal] = useState("0");
  const [activated, setActivated] = useState(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [ticker, setTicker] = useState<MarketTicker | null>(null);
  const [pair, setPair] = useState("BTC");
  const [successMsg, setSuccessMsg] = useState("");

  // Contract picker modal state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState("Futures");
  const [pickerMargin, setPickerMargin] = useState("usdm");
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

  const handleActivate = async () => {
    try {
      await depositFunds("USDT", 1000, "Futures Activation");
      await depositFunds("BTC", 0.05, "Futures Activation");
      setActivated(true);
      loadData();
      setSuccessMsg("Futures account activated with demo funds! 📧 Email sent.");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (e) {
      setActivated(true);
    }
  };

  const handlePlaceOrder = async () => {
    if (!activated) {
      handleActivate();
      return;
    }
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const token = localStorage.getItem("binance_token") ?? "";
    const p = orderType === "Market" ? Number(ticker?.lastPrice ?? 84083) : Number(price);
    try {
      const res = await fetch("http://localhost:4000/api/orders/futures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: `${pair}USDT`,
          side: side.toUpperCase(),
          type: orderType.toUpperCase(),
          price: p,
          quantity: amt,
          leverage: lev,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Order failed");
      }
      const data = await res.json();
      setSuccessMsg(data.position ? "Position opened successfully! 📧 Email sent." : "Limit order placed! 📧 Email sent.");
      setAmount("");
      setSliderVal("0");
      loadData();
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to place order");
    }
  };

  const filteredContracts = CONTRACTS_USDM.filter((c) => {
    if (pickerTab === "Favorites" && !favorites.has(c.symbol)) return false;
    if (searchQuery && !c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="pb-8 bg-bg text-text relative min-h-dvh">
      <TopTabs
        tabs={MARGIN_TABS}
        active={tab}
        onChange={setTab}
        right={<button onClick={() => alert("Menu options")}><Icon name="menu" color={colors.muted} /></button>}
      />

      {successMsg ? (
        <div className="m-4 rounded-lg bg-green/20 p-3 text-center text-sm font-semibold text-green">
          {successMsg}
        </div>
      ) : null}

      {tab === "USDⓈ-M" || tab === "COIN-M" ? (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2 text-left"
            >
              <div>
                <span className="text-xl font-bold">{pair}/USDT</span>
                <span className="ml-2 rounded bg-surface2 px-2 text-xs">Perp</span>
              </div>
              <span className="text-muted">▾</span>
            </button>
            <div className="text-right">
              <span className="text-lg font-bold">{ticker ? Number(ticker.lastPrice).toLocaleString() : "84,083"}</span>
              <span className={`block text-xs ${ticker && Number(ticker.changePercent) >= 0 ? "text-green" : "text-red"}`}>
                {ticker ? `${ticker.changePercent}%` : "-2.76%"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-3">
              <div className="flex rounded-lg border border-line overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSide("buy")}
                  className={`flex-1 py-2 text-sm font-bold ${side === "buy" ? "bg-green text-black" : "text-muted"}`}
                >
                  Buy / Long
                </button>
                <button
                  type="button"
                  onClick={() => setSide("sell")}
                  className={`flex-1 py-2 text-sm font-bold ${side === "sell" ? "bg-red text-white" : "text-muted"}`}
                >
                  Sell / Short
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCross(!cross)}
                  className="flex-1 rounded-lg bg-surface py-2 text-xs font-semibold hover:bg-surface2"
                >
                  {cross ? "Cross" : "Isolated"}
                </button>
                <button
                  onClick={() => setLev((l) => (l >= 100 ? 5 : l * 2))}
                  className="flex-1 rounded-lg bg-surface py-2 text-xs font-semibold hover:bg-surface2"
                >
                  {lev}x
                </button>
              </div>

              <div className="rounded-lg bg-surface p-3 flex justify-between items-center">
                <span className="text-xs text-muted">Order Type</span>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as any)}
                  className="bg-surface2 rounded px-2 py-1 text-xs"
                >
                  <option value="Limit">Limit</option>
                  <option value="Market">Market</option>
                </select>
              </div>

              {orderType === "Limit" ? (
                <div className="rounded-lg bg-surface p-3">
                  <small className="text-muted block text-[11px]">Price (USDT)</small>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-transparent font-semibold outline-none text-sm mt-1"
                  />
                </div>
              ) : null}

              <div className="rounded-lg bg-surface p-3 flex items-center justify-between">
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent font-semibold outline-none text-sm"
                />
                <span className="text-xs text-muted">{pair}</span>
              </div>

              <div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="25"
                  value={sliderVal}
                  onChange={(e) => {
                    setSliderVal(e.target.value);
                    const max = (currentBal * lev) / Number(ticker?.lastPrice || 84083);
                    setAmount((max * (Number(e.target.value) / 100)).toFixed(4));
                  }}
                  className="w-full accent-yellow"
                />
                <div className="flex justify-between text-[10px] text-muted px-1">
                  <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-muted px-1">
                <span>Avbl Balance</span>
                <span className="text-text font-medium">{currentBal.toFixed(2)} {tab === "COIN-M" ? "BTC" : "USDT"}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className={`w-full rounded-xl py-3.5 font-bold text-sm transition-opacity hover:opacity-90 ${
                  !activated
                    ? "bg-yellow text-black"
                    : side === "buy"
                    ? "bg-green text-black"
                    : "bg-red text-white"
                }`}
              >
                {!activated ? "Activate Futures Account" : side === "buy" ? `Buy / Long ${pair}` : `Sell / Short ${pair}`}
              </button>
            </div>

            {/* Order Book / Live Market view */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-muted">
                <span>Funding (8h)</span>
                <span className="text-text">0.0055% / 03:41:12</span>
              </div>
              <div className="rounded-lg bg-surface p-2 text-xs space-y-1 font-mono">
                <div className="text-red font-semibold">84,120.50 (Ask)</div>
                <div className="text-red font-semibold">84,105.10 (Ask)</div>
                <div className="py-1 text-center font-bold text-base text-yellow">
                  {ticker ? Number(ticker.lastPrice).toLocaleString() : "84,083.00"}
                </div>
                <div className="text-green font-semibold">84,070.20 (Bid)</div>
                <div className="text-green font-semibold">84,055.00 (Bid)</div>
              </div>
            </div>
          </div>
        </div>
      ) : tab === "Options" ? (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Crypto Options Chain</h2>
          <div className="space-y-2">
            {[
              { strike: "$86,000 Call", iv: "62.4%", price: "$1,450" },
              { strike: "$84,000 Call", iv: "60.1%", price: "$2,320" },
              { strike: "$82,000 Put", iv: "65.8%", price: "$980" },
            ].map((o) => (
              <div key={o.strike} className="flex justify-between items-center rounded-xl bg-surface p-4">
                <div>
                  <b className="text-text">{o.strike}</b>
                  <small className="block text-muted">IV: {o.iv}</small>
                </div>
                <div className="text-right">
                  <span className="text-yellow font-bold">{o.price}</span>
                  <button onClick={() => alert("Trading option")} className="block mt-1 rounded bg-surface2 px-3 py-1 text-xs">Trade</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-bold">Smart Money & Whale Flows</h2>
          <div className="space-y-3">
            {[
              { coin: "BTC", flow: "+14.53M USDT", sentiment: "Bullish Long" },
              { coin: "ETH", flow: "+13.27M USDT", sentiment: "Bullish Long" },
              { coin: "SOL", flow: "+3.44M USDT", sentiment: "Long" },
            ].map((s) => (
              <div key={s.coin} className="flex justify-between items-center rounded-xl bg-surface p-4">
                <div>
                  <b className="text-text">{s.coin}/USDT Perp</b>
                  <small className="block text-green">Dominant Flow: {s.flow}</small>
                </div>
                <span className="rounded bg-green/20 px-3 py-1 text-xs text-green font-semibold">{s.sentiment}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contract Picker Bottom Sheet Modal */}
      {showPicker ? (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowPicker(false)} />
          <div className="relative z-10 max-h-[85vh] rounded-t-2xl bg-bg border-t border-line flex flex-col p-4 animate-in fade-in slide-in-from-bottom-5">
            <div className="mx-auto h-1 w-12 rounded-full bg-muted mb-3" />
            <div className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2 mb-3">
              <Icon name="search" size={18} color={colors.muted} />
              <input
                type="text"
                placeholder="Search contracts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-text text-sm"
              />
            </div>

            <div className="flex gap-4 border-b border-line pb-2 overflow-x-auto">
              {["Favorites", "Spot", "Futures", "TradFi", "Alpha", "Options"].map((t) => (
                <button
                  key={t}
                  onClick={() => setPickerTab(t)}
                  className={`text-sm font-bold whitespace-nowrap pb-1 ${pickerTab === t ? "border-b-2 border-yellow text-text" : "text-muted"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-3 py-3 border-b border-line items-center">
              <button
                onClick={() => setPickerMargin("usdm")}
                className={`px-3 py-1 rounded text-xs font-semibold ${pickerMargin === "usdm" ? "bg-yellow text-black" : "text-muted"}`}
              >
                USDⓈ-M
              </button>
              <button
                onClick={() => setPickerMargin("cm")}
                className={`px-3 py-1 rounded text-xs font-semibold ${pickerMargin === "cm" ? "bg-yellow text-black" : "text-muted"}`}
              >
                COIN-M
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 space-y-2">
              {filteredContracts.map((c) => {
                const isFav = favorites.has(c.symbol);
                return (
                  <div
                    key={c.symbol}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface cursor-pointer"
                    onClick={() => {
                      setPair(c.symbol.replace("USDT", ""));
                      setShowPicker(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const n = new Set(favorites);
                          if (isFav) n.delete(c.symbol);
                          else n.add(c.symbol);
                          setFavorites(n);
                        }}
                        className={`text-lg ${isFav ? "text-yellow" : "text-muted"}`}
                      >
                        {isFav ? "★" : "☆"}
                      </button>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full font-bold text-white text-xs" style={{ backgroundColor: c.color }}>
                        {c.glyph}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <b className="text-text">{c.symbol}</b>
                          <span className="text-[10px] bg-surface2 px-1.5 rounded text-muted">Perp</span>
                        </div>
                        <small className="text-muted">{c.name} | Vol {c.vol}</small>
                      </div>
                    </div>
                    <div className="text-right">
                      <b className="text-text">{c.price}</b>
                      <span className={`block text-xs ${c.chg >= 0 ? "text-green" : "text-red"}`}>
                        {c.chg >= 0 ? "+" : ""}{c.chg}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
