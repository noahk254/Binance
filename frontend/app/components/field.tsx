"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { tall?: boolean };

export function Field({ tall, className = "", ...rest }: FieldProps) {
  return (
    <input
      {...rest}
      className={`w-full rounded-[8px] bg-surface text-center text-[14px] text-text transition-colors outline-none placeholder:text-muted focus:bg-[#20262D] ${tall ? "py-[17px]" : "py-[12px]"} ${className}`}
    />
  );
}

type FieldButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  right?: ReactNode;
  labelClassName?: string;
};

export function FieldButton({ label, right, className = "", labelClassName = "", ...rest }: FieldButtonProps) {
  return (
    <button
      {...rest}
      type="button"
      className={`flex w-full items-center justify-between rounded-[8px] bg-surface px-4 py-[11px] transition-colors hover:bg-[#20262D] ${className}`}
    >
      <span className={`text-[14px] text-text ${labelClassName}`}>{label}</span>
      {right}
    </button>
  );
}