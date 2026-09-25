"use client";

import type { ReactNode } from "react";

export function TokenMark({ label, color = "#FCD535" }: { label: string; color?: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-onyellow" style={{ backgroundColor: color }}>
      {label.slice(0, 1)}
    </span>
  );
}

export function FeatureCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[14px] bg-surface p-4 ${className}`}>{children}</section>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[19px] font-semibold text-text">{children}</h2>
      {action}
    </div>
  );
}
