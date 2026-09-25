"use client";

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2"
    >
      <span className={`flex h-[20px] w-9 items-center rounded-full px-[2px] transition-colors ${checked ? "bg-green" : "bg-surface2"}`}>
        <span
          className={`h-4 w-4 rounded-full shadow transition-transform ${checked ? "translate-x-4 bg-white" : "translate-x-0 bg-muted"}`}
        />
      </span>
      <span className="text-[13.5px] text-muted">{label}</span>
    </button>
  );
}