import React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export interface SetupSectionProps {
  icon: IconSvgElement;
  title: string;
  meta?: string;
  children: React.ReactNode;
}

export const SetupSection: React.FC<SetupSectionProps> = ({ icon, title, meta, children }) => (
  <section className="rounded-lg border border-slate-200 bg-white">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={icon} className="h-4.5 w-4.5 text-slate-800" />
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
      </div>
      {meta && <span className="text-xs font-bold text-[#0f766e]">{meta}</span>}
    </div>
    <div className="space-y-1 px-2 pb-2">{children}</div>
  </section>
);
