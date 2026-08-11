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
        "grid w-full grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-3 text-left",
        "transition hover:bg-[#f7f4ec]",
        disabled && "cursor-not-allowed opacity-50",
        checked && "bg-[#f6f1e4]",
      )}
    >
      <Checkbox
        checked={checked}
        tabIndex={-1}
        className="pointer-events-none"
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-extrabold text-slate-900">{title}</span>
        {description && (
          <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
            {description}
          </span>
        )}
      </span>
      <span className="flex items-center gap-3 text-right">
        <span className="whitespace-nowrap text-sm font-black text-slate-900">
          {Number(count || 0).toLocaleString()}개
        </span>
        {action}
      </span>
    </div>
  );
};
