"use client";

const SECTIONS: Array<[string, string[]]> = [
  ["General", ["UID|517550898"]],
  ["Preference", ["Language|English (Africa)", "Currency|KES", "Asset Filter|"]],
  ["Others", ["Help & Support|", "Clear Cache and Relaunch|", "About Us|", "Check for updates|v3.20.6"]],
];
export function SettingsScreen({ onBack }: { onBack?: () => void }) {
 return <div className="pb-8"><div className="flex items-center gap-3 px-4 pt-5"><button onClick={onBack} aria-label="Back" className="text-xl">←</button></div><h1 className="px-4 pt-4 text-[32px] font-bold text-text">Settings</h1>{SECTIONS.map(([title, rows]) => <section key={title} className="mt-6"><h2 className="px-4 text-sm text-muted">{title}</h2><div className="mt-1 border-y border-line">{rows.map((item) => { const [label, value] = item.split("|"); return <button key={label} className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-surface"><span className="text-[17px] text-text">{label}</span><span className="text-sm text-muted">{value}{label === "UID" ? "  ⧉" : label !== "Check for updates" && label !== "Clear Cache and Relaunch" ? "  ›" : ""}</span></button>; })}</div></section>)}</div>;
}
