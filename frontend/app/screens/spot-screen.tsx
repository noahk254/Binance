"use client";

import { useEffect, useState } from "react";
import { colors } from "../components/theme";
import { TopTabs } from "../components/top-tabs";
import { BuySellSegment, Side } from "../components/segment";
import { Field, FieldButton } from "../components/field";
import { AmountSlider } from "../components/amount-slider";
import { Checkbox } from "../components/checkbox";
import { OrderBook } from "../components/order-book";
import { EmptyState } from "../components/empty-state";

import { Icon, YellowPlus } from "../components/icons";
import { getTicker, type MarketTicker } from "../lib/api";

const MARKET_TABS = ["Buy/Sell", "Spot", "Stocks", "Prediction", "Margin"];
const ORDER_TABS = ["Open Orders (0)", "Holdings", "Bots"];

export function SpotScreen() {
  const [market, setMarket] = useState("Spot");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [side, setSide] = useState<Side>("Buy");
  const [orderTab, setOrderTab] = useState(ORDER_TABS[0]);
  const [tpsl, setTpsl] = useState(false);
  const [iceberg, setIceberg] = useState(false);
  const buy = side === "Buy";
  const [ticker, setTicker] = useState<MarketTicker | null>(null);
  useEffect(() => { getTicker(symbol).then(setTicker).catch(() => setTicker(null)); }, [symbol]);

  return (
    <div className="relative min-h-full">
      <div className="app-scroll absolute inset-0 overflow-y-auto pb-6">
        <TopTabs
          tabs={MARKET_TABS}
          active={market}
          onChange={(next) => { setMarket(next); setSymbol(next === "Stocks" ? "ETHUSDT" : "BTCUSDT"); }}
          right={<Icon name="menu" color={colors.muted} />}
        />

        <div className="flex items-start justify-between px-4 pt-3">
          <div>
            <button type="button" className="flex items-center gap-2">
              <span className="text-[20px] font-semibold text-text">{symbol} · {ticker ? Number(ticker.lastPrice).toLocaleString() : "--"}</span>
              <Icon name="caretDown" size={16} color={colors.text} strokeWidth={2.2} />
            </button>
            <p className={`mt-0.5 text-[13px] ${ticker && Number(ticker.changePercent) >= 0 ? "text-green" : "text-red"}`}>{ticker ? `${ticker.changePercent}%` : "--%"}</p>
          </div>
          <div className="flex items-center gap-4">
            <Icon name="candle" color={colors.muted} />
            <div className="relative">
              <Icon name="dots" color={colors.muted} />
              <span className="absolute -right-1.5 -top-1 h-[7px] w-[7px] rounded-full bg-yellow" aria-hidden />
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-4 pt-2.5">
          <div className="flex flex-[1.08] flex-col gap-2.5">
            <BuySellSegment side={side} onChange={setSide} />

            <FieldButton
              label="Limit"
              right={
                <span className="flex items-center gap-2.5">
                  <Icon name="info" size={17} color={colors.muted} />
                  <span className="h-4 w-px bg-surface2" aria-hidden />
                  <Icon name="caretDown" size={16} color={colors.muted} strokeWidth={2.2} />
                </span>
              }
            />

            <span className="flex gap-2.5">
              <Field placeholder={`Price (${ticker ? Number(ticker.lastPrice).toFixed(2) : "--"})`} className="flex-1" />
              <FieldButton label="BBO" labelClassName="font-semibold" className="w-auto px-[18px]" />
            </span>

            <Field placeholder="Amount (--)" />
            <AmountSlider />
            <Field placeholder="Total (--)" tall />

            <span className="mt-0.5 flex gap-3">
              <Checkbox label="TP/SL" checked={tpsl} onChange={setTpsl} />
              <Checkbox label="Iceberg" checked={iceberg} onChange={setIceberg} />
            </span>

            <span className="mt-1.5 flex flex-col gap-2">
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-[13.5px] text-muted">
                  Avbl
                  <Icon name="caretDown" size={14} color={colors.muted} strokeWidth={2.2} />
                </span>
                <span className="flex items-center gap-2 text-[13.5px] text-muted">
                  -- --
                  <YellowPlus size={22} />
                </span>
              </span>
              <span className="flex items-center justify-between">
                <span className="border-b border-dotted border-dim text-[13.5px] text-muted">Max Buy</span>
                <span className="text-[13.5px] text-muted">-- --</span>
              </span>
              <span className="flex items-center justify-between">
                <span className="border-b border-dotted border-dim text-[13.5px] text-muted">Est. Fee</span>
                <span className="text-[13.5px] text-muted">-- --</span>
              </span>
            </span>

            <button
              type="button"
              className={`mt-1.5 rounded-[10px] py-3.5 text-center text-[16px] font-semibold transition-opacity hover:opacity-90 ${
                buy ? "bg-green text-onyellow" : "bg-red text-white"
              }`}
            >
              {buy ? "Buy BTC" : "Sell BTC"}
            </button>
          </div>

          <div className="flex-1">
            <OrderBook tick="0.00000001" />
          </div>
        </div>

        <TopTabs
          tabs={ORDER_TABS}
          active={orderTab}
          onChange={setOrderTab}
          underline
          right={<Icon name="history" color={colors.muted} />}
        />
        <div className="h-px bg-line" />

        <EmptyState icon="emptyCoin" message={orderTab === "Open Orders (0)" ? "No open spot orders." : orderTab === "Holdings" ? "No spot holdings yet." : "No trading bots configured."} />
      </div>
    </div>
  );
}
