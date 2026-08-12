import React from "react";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 8;

function normalizeCode(value: string): string {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, CODE_LENGTH);
}

interface VerificationCodeInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const code = normalizeCode(value);

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        value={code}
        onChange={(event) => onChange(normalizeCode(event.target.value))}
        disabled={disabled}
        autoCapitalize="characters"
        autoComplete="one-time-code"
        spellCheck={false}
        inputMode="text"
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
      />
      <div
        aria-hidden="true"
        className={cn(
          "grid grid-cols-[repeat(4,minmax(0,1fr))_0.75rem_repeat(4,minmax(0,1fr))] gap-1.5 sm:gap-2",
          disabled && "opacity-60"
        )}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-lg font-bold text-slate-100 shadow-sm transition-colors",
              code.length === index && !disabled && "border-teal-500 ring-2 ring-teal-500/20"
            )}
          >
            {code[index] || ""}
          </div>
        ))}
        <span className="flex h-12 items-center justify-center text-slate-500 font-bold">
          -
        </span>
        {Array.from({ length: 4 }).map((_, offset) => {
          const index = offset + 4;
          return (
            <div
              key={index}
              className={cn(
                "flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-lg font-bold text-slate-100 shadow-sm transition-colors",
                code.length === index && !disabled && "border-teal-500 ring-2 ring-teal-500/20"
              )}
            >
              {code[index] || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationCodeInput;
