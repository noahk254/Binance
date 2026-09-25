export function Tag({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "yellow" }) {
  return <span className={`rounded px-2 py-1 text-[11px] ${tone === "yellow" ? "bg-[#413915] text-yellow" : "bg-surface2 text-muted"}`}>{children}</span>;
}
