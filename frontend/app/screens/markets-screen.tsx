"use client";

import { useEffect, useMemo, useState } from "react";
import { colors } from "../components/theme";
import { TopTabs } from "../components/top-tabs";
import { Skeleton } from "../components/skeleton";
import { Icon } from "../components/icons";
import { getMarkets, type MarketTicker } from "../lib/api";

const CATEGORIES = ["Favorites", "Crypto", "TradFi", "Alpha", "Prediction"];
const SECTIONS = ["Stocks", "Spot", "Futures"];
const KINDS = ["US Stocks", "ETFs"];

const CATEGORY_DATA: Record<string, MarketTicker[]> = {
  Favorites: [
    { symbol: "BTCUSDT", lastPrice: "85854.79", changePercent: "2.019", high: "", low: "", quoteVolume: "" },
    { symbol: "ETHUSDT", lastPrice: "2742.59", changePercent: "1.182", high: "", low: "", quoteVolume: "" },
  ],
  TradFi: [
    { symbol: "MSTR", lastPrice: "20191.90", changePercent: "13.44", high: "", low: "", quoteVolume: "" },
    { symbol: "AEHR", lastPrice: "11350.59", changePercent: "12.59", high: "", low: "", quoteVolume: "" },
    { symbol: "LUNR", lastPrice: "1821.35", changePercent: "12.16", high: "", low: "", quoteVolume: "" },
    { symbol: "XLK", lastPrice: "24564.66", changePercent: "10.79", high: "", low: "", quoteVolume: "" },
  ],
  Alpha: [
    { symbol: "PAID", lastPrice: "3.05477", changePercent: "-2.46", high: "", low: "", quoteVolume: "" },
    { symbol: "PONS", lastPrice: "83.28", changePercent: "-5.26", high: "", low: "", quoteVolume: "" },
    { symbol: "GENIUS", lastPrice: "44.03", changePercent: "0.00", high: "", low: "", quoteVolume: "" },
  ],
  Prediction: [
    { symbol: "BTC UP", lastPrice: "58%", changePercent: "+4.20", high: "", low: "", quoteVolume: "" },
    { symbol: "ETH UP", lastPrice: "54%", changePercent: "+2.10", high: "", low: "", quoteVolume: "" },
    { symbol: "GOLD UP", lastPrice: "51%", changePercent: "+0.60", high: "", low: "", quoteVolume: "" },
  ],
};

const SECTION_DATA: Record<string, MarketTicker[]> = {
  Stocks: [
    { symbol: "SNXX", lastPrice: "2302.68", changePercent: "16.74", high: "", low: "", quoteVolume: "" },
    { symbol: "MSTR", lastPrice: "20191.90", changePercent: "13.44", high: "", low: "", quoteVolume: "" },
    { symbol: "AEHR", lastPrice: "11350.59", changePercent: "12.59", high: "", low: "", quoteVolume: "" },
    { symbol: "LUNR", lastPrice: "1821.35", changePercent: "12.16", high: "", low: "", quoteVolume: "" },
  ],
  Spot: [
    { symbol: "BTCUSDT", lastPrice: "85854.79", changePercent: "2.019", high: "", low: "", quoteVolume: "" },
    { symbol: "ETHUSDT", lastPrice: "2742.59", changePercent: "1.182", high: "", low: "", quoteVolume: "" },
    { symbol: "SOLUSDT", lastPrice: "14470.15", changePercent: "5.08", high: "", low: "", quoteVolume: "" },
    { symbol: "BNBUSDT", lastPrice: "712.88", changePercent: "-0.84", high: "", low: "", quoteVolume: "" },
  ],
  Futures: [
    { symbol: "BTCUSDT PERP", lastPrice: "85854.79", changePercent: "3.84", high: "", low: "", quoteVolume: "" },
    { symbol: "ETHUSDT PERP", lastPrice: "2742.59", changePercent: "5.03", high: "", low: "", quoteVolume: "" },
    { symbol: "SOLUSDT PERP", lastPrice: "14470.15", changePercent: "5.08", high: "", low: "", quoteVolume: "" },
  ],
};

export function MarketsScreen() {
  const [category, setCategory] = useState("TradFi");
  const [section, setSection] = useState("Stocks");
  const [kind, setKind] = useState("US Stocks");
  const [markets, setMarkets] = useState<MarketTicker[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getMarkets()
      .then((data) => active && setMarkets(data))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Unable to load markets"));
    return () => { active = false; };
  }, []);

  const filteredMarkets = useMemo(() => {
    if (category === "TradFi" && section === "Stocks") return kind === "ETFs" ? [{ symbol: "XLK", lastPrice: "24564.66", changePercent: "10.79", high: "", low: "", quoteVolume: "" }] : SECTION_DATA.Stocks;
    if (category === "Crypto") return section === "Stocks" ? markets.filter((market) => market.symbol.endsWith("USDT")) : SECTION_DATA[section];
    if (category === "Favorites") return section === "Futures" ? SECTION_DATA.Futures.slice(0, 2) : CATEGORY_DATA.Favorites;
    return CATEGORY_DATA[category] ?? SECTION_DATA[section] ?? [];
  }, [category, kind, markets, section]);

  return (
    <div className="pb-6">
      <div className="flex items-center gap-3.5 px-4 pt-1.5">
        <div className="flex flex-1 items-center gap-2.5 rounded-[10px] bg-surface px-3.5 py-2.5">
          <Icon name="search" size={19} color={colors.muted} />
          <span className="text-[14px] text-muted">Search coin pair and trend</span>
        </div>
        <div className="relative">
          <Icon name="dots" color={colors.muted} />
          <span className="absolute -right-1.5 -top-1 h-[7px] w-[7px] rounded-full bg-yellow" aria-hidden />
        </div>
      </div>

      <TopTabs tabs={CATEGORIES} active={category} onChange={setCategory} underline />
      <div className="h-px bg-line" />

      <div className="flex gap-5 overflow-x-auto px-4 pt-3.5">
        {SECTIONS.map((sec) => (
          <button key={sec} type="button" onClick={() => setSection(sec)}>
            <span className={`text-[16px] font-semibold transition-colors ${section === sec ? "text-text" : "text-muted"}`}>
              {sec}
            </span>
          </button>
        ))}
      </div>

      {category === "TradFi" || category === "Crypto" ? <div className="flex gap-2.5 px-4 pt-3.5">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`rounded-[8px] px-4 py-2 transition-colors ${kind === k ? "bg-surface2" : "hover:bg-surface"}`}
          >
            <span className={`text-[14px] font-medium ${kind === k ? "text-text" : "text-muted"}`}>{k}</span>
          </button>
        ))}
      </div> : <p className="px-4 pt-4 text-sm text-muted">{category === "Favorites" ? "Your saved markets" : category === "Alpha" ? "Early opportunities and trending tokens" : "Prediction markets and probabilities"}</p>}

      {error ? <p className="mx-4 mt-5 rounded-lg bg-surface px-3 py-3 text-sm text-red">{error}. Is the backend running on port 4000?</p> : null}
      {!markets.length && !error ? <div className="flex flex-wrap px-4 pt-4" role="progressbar" aria-label="Loading market data">{Array.from({ length: 24 }).map((_, i) => <div key={i} className="w-1/3 pb-11 pr-5"><Skeleton className={`h-[34px] ${i % 3 === 0 ? "w-[88%]" : "w-full"}`} delay={(i % 6) * 120} /></div>)}</div> : null}
      {filteredMarkets.length ? <div className="grid grid-cols-3 gap-x-5 gap-y-6 px-4 pt-5">{filteredMarkets.map((market) => <div key={market.symbol}><p className="truncate text-sm font-semibold text-text">{market.symbol.replace("USDT", "/USDT")}</p><p className="mt-1 truncate text-sm text-text">{Number(market.lastPrice).toLocaleString(undefined, { maximumSignificantDigits: 8 })}</p><p className={`mt-1 text-xs ${Number(market.changePercent) >= 0 ? "text-green" : "text-red"}`}>{Number(market.changePercent).toFixed(2)}%</p></div>)}</div> : null}
    </div>
  );
}
