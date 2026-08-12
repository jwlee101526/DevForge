import React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export interface SetupSectionProps {
  icon: IconSvgElement;
  title: string;
  meta?: string;
  children: React.ReactNode;
}

export const SetupSection: React.FC<SetupSectionProps> = ({ icon, title, meta, children }) => (
  <section className="rounded-2xl bg-white p-4 shadow-xs">
    <div className="flex items-center justify-between px-2 pb-3">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={icon} className="h-4.5 w-4.5 text-indigo-600" />
        <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
      </div>
      {meta && <span className="text-xs font-bold text-indigo-600">{meta}</span>}
    </div>
    <div className="space-y-1">{children}</div>
  </section>
);
