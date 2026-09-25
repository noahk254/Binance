"use client";

import type { ReactNode } from "react";

export function TopTabs({
  tabs,
  active,
  onChange,
  right,
  underline = false,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  right?: ReactNode;
  underline?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4">
      <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = t === active;
          return (
            <button key={t} type="button" onClick={() => onChange(t)} className="relative shrink-0 px-0.5 py-3">
              <span className={`whitespace-nowrap text-[16px] font-semibold transition-colors ${isActive ? "text-text" : "text-muted"}`}>
                {t}
              </span>
              {underline ? (
                <span
                  className={`absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-yellow transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {right ?? null}
    </div>
  );
}