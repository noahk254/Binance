"use client";

import { colors } from "./theme";
import { Icon, IconName } from "./icons";

export type TabKey = "Home" | "Markets" | "Trade" | "Futures" | "Assets";

const TABS: { key: TabKey; label: string; icon: IconName }[] = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "Markets", label: "Markets", icon: "markets" },
  { key: "Trade", label: "Trade", icon: "trade" },
  { key: "Futures", label: "Futures", icon: "futures" },
  { key: "Assets", label: "Assets", icon: "assets" },
];

export function BottomNav({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <nav
      className="flex shrink-0 items-stretch border-t border-line bg-surface"
      style={{ height: 64 }}
      aria-label="Main navigation"
    >
      {TABS.map(({ key, label, icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex flex-1 flex-col items-center justify-center gap-[3px] transition-colors hover:opacity-80"
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
          >
            <Icon name={icon} size={24} color={isActive ? colors.yellow : colors.muted} />
            <span className={`text-[10.5px] font-medium leading-none ${isActive ? "text-yellow" : "text-muted"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}