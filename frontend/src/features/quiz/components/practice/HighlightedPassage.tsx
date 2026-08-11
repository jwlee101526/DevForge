import React from "react";

export interface HighlightedPassageProps {
  text?: string;
  target?: string;
  active?: boolean;
}

function escapeRegExp(value: string): string {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const HighlightedPassage: React.FC<HighlightedPassageProps> = ({ text, target, active = false }) => {
  if (!active || !text || !target) return <>{text}</>;

  const pattern = new RegExp(`(${escapeRegExp(target)})`, "gi");
  const parts = String(text).split(pattern);
  if (parts.length <= 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() !== String(target).toLowerCase()) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }
        return (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-amber-100 px-1 py-0.5 font-black text-amber-950 ring-1 ring-amber-300"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
};
