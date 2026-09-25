"use client";

import { colors } from "./theme";
import { Icon } from "./icons";
import { FieldButton } from "./field";

export type Level = { price: string; amount: string; depth: number };

const PLACEHOLDER: Level[] = [4, 3, 2, 1, 0].map((i) => ({
  price: "--",
  amount: "--",
  depth: 0.18 + i * 0.09,
}));

/** Asks above, last price, bids below, then the buy/sell pressure bar. */
export function OrderBook({
  asks = PLACEHOLDER,
  bids = PLACEHOLDER,
  last = "--",
  mark = "--",
  buyRatio = 0,
  tick = "0.1",
}: {
  asks?: Level[];
  bids?: Level[];
  last?: string;
  mark?: string;
  buyRatio?: number;
  tick?: string;
}) {
  const row = (lvl: Level, side: "ask" | "bid", key: string) => (
    <div key={key} className="relative flex justify-between py-[3px]">
      <span
        className={`absolute inset-y-0 right-0 ${side === "ask" ? "bg-red" : "bg-green"} opacity-[0.13]`}
        style={{ width: `${lvl.depth * 100}%` }}
        aria-hidden
      />
      <span className={`relative text-[12.5px] ${side === "ask" ? "text-red" : "text-green"}`}>{lvl.price}</span>
      <span className="relative text-[12.5px] text-muted">{lvl.amount}</span>
    </div>
  );

  return (
    <div>
      <div className="mb-1.5 flex justify-between">
        <div>
          <p className="text-[12.5px] text-muted">Price</p>
          <p className="text-[11.5px] text-muted">(--)</p>
        </div>
        <div className="text-right">
          <p className="text-[12.5px] text-muted">Amount</p>
          <p className="text-[11.5px] text-muted">(--)</p>
        </div>
      </div>

      {asks.map((l, i) => row(l, "ask", `a${i}`))}

      <div className="flex flex-col items-center py-2">
        <span className="text-[16px] font-semibold text-green">{last}</span>
        <span className="text-[11px] text-muted">{mark}</span>
      </div>

      {bids.map((l, i) => row(l, "bid", `b${i}`))}

      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[11.5px] text-green">{(buyRatio * 100).toFixed(2)}%</span>
        <div className="flex h-1 flex-1 overflow-hidden rounded-full">
          <span style={{ flex: Math.max(buyRatio, 0.02) }} className="bg-green" />
          <span style={{ flex: Math.max(1 - buyRatio, 0.02) }} className="bg-red" />
        </div>
        <span className="text-[11.5px] text-red">{((1 - buyRatio) * 100).toFixed(2)}%</span>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2.5">
        <FieldButton
          label={tick}
          labelClassName="text-muted"
          className="flex-1 px-3 py-2"
          right={<Icon name="caretDown" size={16} color={colors.muted} strokeWidth={2.2} />}
        />
        <div className="grid w-[34px] grid-cols-2 gap-[3px]" aria-hidden>
          <span className="h-[6px] rounded-[2px] bg-muted" />
          <span className="h-[6px] rounded-[2px] bg-red" />
          <span className="h-[6px] rounded-[2px] bg-muted" />
          <span className="h-[6px] rounded-[2px] bg-green" />
        </div>
      </div>
    </div>
  );
}