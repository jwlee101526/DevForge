import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface ScopeRowProps {
  checked: boolean;
  title: string;
  description?: string;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  action?: React.ReactNode;
}

export const ScopeRow: React.FC<ScopeRowProps> = ({
  checked,
  title,
  description,
  count,
  onClick,
  disabled = false,
  action,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "grid w-full grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all",
        "hover:bg-slate-100/70",
        disabled && "cursor-not-allowed opacity-50",
        checked && "bg-indigo-50/60 font-bold",
      )}
    >
      <Checkbox
        checked={checked}
        tabIndex={-1}
        className="pointer-events-none"
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-slate-900">{title}</span>
        {description && (
          <span className="mt-0.5 block truncate text-xs text-slate-400">
            {description}
          </span>
        )}
      </span>
      <span className="flex items-center gap-3 text-right">
        <span className="whitespace-nowrap text-sm font-extrabold text-slate-900">
          {Number(count || 0).toLocaleString()}개
        </span>
        {action}
      </span>
    </div>
  );
};
