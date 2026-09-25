export function Skeleton({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div
      className={`animate-skeleton rounded-[8px] bg-skeleton ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      aria-hidden
    />
  );
}