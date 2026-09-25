"use client";

export function Toast({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-6">
      <button
        type="button"
        onClick={onDismiss}
        className="pointer-events-auto mx-auto flex items-center gap-3 rounded-[10px] bg-toast px-4 py-3"
      >
        <span className="text-[13.5px] text-text">{message}</span>
        <span className="text-[13.5px] text-muted" aria-hidden>
          ✕
        </span>
      </button>
    </div>
  );
}