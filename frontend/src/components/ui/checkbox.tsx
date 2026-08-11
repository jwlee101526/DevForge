import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center justify-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          className={cn(
            "peer h-4 w-4 appearance-none rounded border border-slate-400 bg-white transition-colors cursor-pointer checked:border-[#0f766e] checked:bg-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <HugeiconsIcon
          icon={Tick02Icon}
          className="pointer-events-none absolute h-3 w-3 stroke-[3] text-white opacity-0 peer-checked:opacity-100"
        />
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
