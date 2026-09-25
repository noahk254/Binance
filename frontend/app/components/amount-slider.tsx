"use client";

import { useRef, useState } from "react";

const PIPS = [0, 25, 50, 75, 100];

/** Order-size slider with the app's rotated-square knob and quarter pips. */
export function AmountSlider({ onChange }: { onChange?: (pct: number) => void }) {
  const [pct, setPct] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    setPct(next);
    onChange?.(next);
  };

  return (
    <div
      ref={trackRef}
      className="relative mx-1.5 h-7 cursor-pointer touch-none select-none"
      role="slider"
      aria-label="Order size as percent of available balance"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons > 0) setFromClientX(e.clientX);
      }}
    >
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-surface2" />
      <div className="absolute top-1/2 h-px -translate-y-1/2 bg-yellow" style={{ width: `${pct}%` }} />
      {PIPS.map((p) => (
        <div
          key={p}
          aria-hidden
          className={`absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 border ${
            pct >= p && p > 0 ? "border-yellow bg-yellow" : "border-surface2 bg-bg"
          }`}
          style={{ left: `${p}%` }}
        />
      ))}
      <div
        aria-hidden
        className="absolute top-1/2 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 rotate-45 border-[1.5px] border-text bg-bg"
        style={{ left: `${pct}%` }}
      />
    </div>
  );
}