"use client";

import { useState } from "react";
import { AmountSlider } from "../components/amount-slider";
import { Checkbox } from "../components/checkbox";
import { EmptyState } from "../components/empty-state";
import { Field, FieldButton } from "../components/field";
import { Icon } from "../components/icons";
import { OrderBook } from "../components/order-book";
import { BuySellSegment, Side } from "../components/segment";

const TABS = ["Swap", "Bridge", "Pro", "Perps"] as const;

function BottomPanel() {
  const [panelTab, setPanelTab] = useState("Open Orders");
  const [dismissed, setDismissed] = useState(false);
  const [onlyCurrent, setOnlyCurrent] = useState(false);

  return (
    <div className="mt-5 space-y-4">
      {!dismissed && (
        <div className="flex items-center justify-between rounded-xl bg-surface p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface2 text-text">
              <Icon name="globe" size={18} />
            </span>
            <div>
              <p className="text-[13.5px] font-medium text-text">0 Service Fees on Arc Chain - Limited Time!</p>
              <p className="text-[12.5px] text-muted">Explore Arc Chain Hub</p>
            </div>
          </div>
          <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-5 border-b border-line">
        {["Open Orders", "Holdings", "Strategy"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setPanelTab(t)}
            className={`border-b-2 pb-2.5 text-[15px] font-semibold transition-colors ${
              panelTab === t ? "border-yellow text-text" : "border-transparent text-muted"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="flex-1" />
        <Icon name="globe" size={18} />
        <Icon name="filter" size={18} />
      </div>

      <Checkbox label="Only show current token" checked={onlyCurrent} onChange={setOnlyCurrent} />
    </div>
  );
}

function TokenField({ label, symbol }: { label: "From" | "To"; symbol: string }) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="text-[13px] text-muted">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <button type="button" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-yellow" />
          <span className="text-[19px] font-semibold text-text">{symbol}</span>
          <Icon name="caretDown" size={16} />
        </button>
        <span className="text-[20px] font-medium text-text">0.00</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[13px] text-muted">
        <span>--</span>
        <span className="flex items-center gap-1.5">
          <span>≈--</span>
          <span className="h-3.5 w-3.5 rounded-full bg-yellow" />
        </span>
      </div>
    </div>
  );
}

function SwapOrBridgeView({ mode }: { mode: "Swap" | "Bridge" }) {
  return (
    <div className="p-4">
      <TokenField label="From" symbol="BNB" />
      <div className="relative my-[-14px] flex justify-center z-10">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-4 border-bg bg-surface2 text-text">
          <Icon name="caretUp" size={16} />
        </span>
      </div>
      <TokenField label="To" symbol={mode === "Swap" ? "USDT" : "ETH"} />

      <button type="button" className="mt-5 w-full rounded-xl bg-yellow py-4 font-semibold text-onyellow">
        Set Up Wallet
      </button>

      <BottomPanel />
    </div>
  );
}

function ProView() {
  const [side, setSide] = useState<Side>("Buy");
  const [tpsl, setTpsl] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <button type="button" className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-yellow" />
        <span className="text-[19px] font-bold text-text">USDT</span>
        <Icon name="caretDown" size={16} />
      </button>

      <div className="flex gap-4">
        <div className="flex-[1.15] space-y-3">
          <div className="space-y-1.5 text-xs">
            {[
              ["Market Cap", "$9.18B"],
              ["24h vol", "$192.18M"],
              ["Liquidity", "$194.64M"],
              ["Holders", "76.35M"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-muted">
                <span>{label}</span>
                <span className="text-text">{val}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[20px] font-bold text-green">$0.99969</p>
            <p className="text-xs text-muted">KSh129.47 <span className="text-green">+0.05%</span></p>
          </div>

          <div className="flex justify-between text-xs text-muted">
            <span>Price</span>
            <span>Time</span>
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className={i % 2 === 0 ? "text-red" : "text-green"}>$0.99969</span>
              <span className="text-muted">-23s</span>
            </div>
          ))}

          <div className="flex h-1 overflow-hidden rounded bg-surface2">
            <div className="bg-green w-[50.15%]" />
            <div className="bg-red w-[49.85%]" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-green">50.15%</span>
            <span className="text-red">49.85%</span>
          </div>

          <FieldButton label="24h" right={<Icon name="caretDown" size={16} color="#848E9C" />} />
        </div>

        <div className="flex-1 space-y-3">
          <BuySellSegment side={side} onChange={setSide} />
          <FieldButton label="Market" right={<Icon name="caretDown" size={16} color="#848E9C" />} />

          <div className="rounded-xl bg-surface p-3.5">
            <p className="text-xs text-muted">Allocate (BNB)</p>
            <div className="mt-2 flex items-center justify-between text-lg text-text">
              <span>—</span>
              <span className="text-xs text-muted">Amount</span>
              <span>+</span>
            </div>
          </div>

          <AmountSlider />
          <Field placeholder="KSh Value" tall />

          <div className="space-y-1.5 text-xs">
            {[
              ["Available", "--"],
              ["Est. Receive", "-- USDT"],
              ["Service Fee", "--"],
              ["Route", "--"],
              ["Wallet", "--"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="border-b border-dotted border-dim text-muted">{k}</span>
                <span className="text-text">{v}</span>
              </div>
            ))}
          </div>

          <Checkbox label="TP/SL" checked={tpsl} onChange={setTpsl} />

          <button type="button" className="w-full rounded-xl bg-yellow py-3.5 font-semibold text-onyellow">
            Set Up Wallet
          </button>
        </div>
      </div>

      <BottomPanel />
    </div>
  );
}

function PerpsView() {
  const [mode, setMode] = useState<"Open" | "Close">("Open");
  const [tpsl, setTpsl] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [perpsTab, setPerpsTab] = useState("Positions (0)");

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="h-5 w-5 rounded-full bg-yellow" />
        <span className="text-[19px] font-bold text-text">BTCUSDT</span>
        <span className="rounded bg-surface2 px-1.5 py-0.5 text-xs text-text">Perp</span>
        <Icon name="caretDown" size={16} />
        <div className="flex-1" />
        <Icon name="walletCard" size={20} color="#848E9C" />
      </div>
      <p className="text-xs text-green">+3.78%</p>

      <div className="flex gap-4">
        <div className="flex-[1.15] space-y-2">
          <p className="text-xs text-muted">Funding (8h) / Countdown</p>
          <p className="text-xs font-medium text-text">0.010000% / 05:04:27</p>
          <OrderBook tick="0.1" last="81,293.6" mark="81293.6" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex rounded-xl bg-surface p-1">
            {(["Open", "Close"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors ${
                  mode === m ? "bg-surface2 text-text" : "text-muted"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <FieldButton label="Cross" right={<Icon name="caretDown" size={14} color="#848E9C" />} className="flex-1" />
            <FieldButton label="20x" right={<Icon name="caretDown" size={14} color="#848E9C" />} className="flex-1" />
          </div>

          <FieldButton
            label="Limit"
            right={
              <span className="flex items-center gap-2">
                <Icon name="info" size={16} color="#848E9C" />
                <Icon name="caretDown" size={16} color="#848E9C" />
              </span>
            }
          />

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Field placeholder="Price" defaultValue="81250" className="pr-14" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text">USDT</span>
            </div>
            <button type="button" className="rounded-xl bg-surface px-4 text-xs font-semibold text-text">
              BBO
            </button>
          </div>

          <div className="relative">
            <Field placeholder="Amount" tall className="pr-14" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text">USDT</span>
          </div>
          <AmountSlider />

          <p className="text-xs text-muted">Avbl --</p>

          <div className="space-y-2">
            <Checkbox label="TP/SL" checked={tpsl} onChange={setTpsl} />
            <div className="flex items-center justify-between">
              <Checkbox label="Hidden Order" checked={hidden} onChange={setHidden} />
              <span className="flex items-center gap-1 text-xs text-muted">
                GTC <Icon name="caretDown" size={14} color="#848E9C" />
              </span>
            </div>
          </div>

          <button type="button" className="w-full rounded-xl bg-yellow py-3.5 font-semibold text-onyellow">
            Set Up Wallet
          </button>
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-line pt-4">
        {["Balance", "Positions (0)", "Open orders (0)"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setPerpsTab(t)}
            className={`border-b-2 pb-2.5 text-[15px] font-semibold transition-colors ${
              perpsTab === t ? "border-yellow text-text" : "border-transparent text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <EmptyState icon="emptyDoc" message="No data" />
    </div>
  );
}

export function SwapScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Swap");

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-4 pt-2 border-b border-line">
        <div className="flex gap-6">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`border-b-2 pb-3 text-[18px] font-semibold transition-colors ${
                tab === t ? "border-yellow text-text" : "border-transparent text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Icon name="fullscreen" size={20} color="#848E9C" />
      </div>

      {tab === "Swap" && <SwapOrBridgeView mode="Swap" />}
      {tab === "Bridge" && <SwapOrBridgeView mode="Bridge" />}
      {tab === "Pro" && <ProView />}
      {tab === "Perps" && <PerpsView />}
    </div>
  );
}
