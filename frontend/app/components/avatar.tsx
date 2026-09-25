export function Avatar({ label, size = 40 }: { label: string; size?: number }) {
  const palette = ["#59616c", "#2775CA", "#26A17B", "#7b61ff", "#d97706"];
  const color = palette[label.length % palette.length];
  return <span aria-label={label} className="flex shrink-0 items-center justify-center rounded-full font-bold text-white" style={{ width: size, height: size, background: color, fontSize: Math.max(11, size * .35) }}>{label.slice(0, 1).toUpperCase()}</span>;
}
