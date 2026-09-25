"use client";

export type Side = "Buy" | "Sell";

export function BuySellSegment({ side, onChange }: { side: Side; onChange: (side: Side) => void }) {
  const buy = side === "Buy";
  return (
    <div className="flex rounded-[8px] bg-surface p-1">
      <button
        type="button"
        onClick={() => onChange("Buy")}
        className={`flex-1 rounded-[6px] px-4 py-2.5 text-center text-[15px] font-semibold transition-colors ${
          buy ? "bg-green text-onyellow" : "text-muted hover:text-text"
        }`}
      >
        Buy
      </button>
      <button
        type="button"
        onClick={() => onChange("Sell")}
        className={`flex-1 rounded-[6px] px-4 py-2.5 text-center text-[15px] font-semibold transition-colors ${
          !buy ? "bg-red text-white" : "text-muted hover:text-text"
        }`}
      >
        Sell
      </button>
    </div>
  );
}