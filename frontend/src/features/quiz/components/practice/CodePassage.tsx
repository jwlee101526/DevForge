import React from "react";

export interface CodePassageProps {
  passage: string;
  targetWord?: string;
  isCodeType?: boolean;
}

export const CodePassage: React.FC<CodePassageProps> = ({ passage, targetWord, isCodeType }) => {
  if (!passage) return null;

  // Strips markdown backticks if AI wrapped passage in ```code``` blocks
  let cleanPassage = passage.trim();
  let detectedLang = "CODE";
  const codeBlockMatch = cleanPassage.match(/^```(\w+)?\n([\s\S]*?)\n```$/);
  if (codeBlockMatch) {
    if (codeBlockMatch[1]) detectedLang = codeBlockMatch[1].toUpperCase();
    cleanPassage = codeBlockMatch[2];
  }

  // Split into lines for IDE rendering
  const lines = cleanPassage.split("\n");

  const renderHighlightedLine = (line: string) => {
    // Replace blanks like ___, [BLANK], ____ with a clear UI Badge
    const blankRegex = /(_{2,}|\[BLANK\]|\[빈칸\])/gi;
    const parts = line.split(blankRegex);

    return parts.map((part, idx) => {
      if (blankRegex.test(part)) {
        return (
          <span
            key={idx}
            className="inline-block mx-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs tracking-wider shadow-xs border border-amber-300 ring-2 ring-amber-400/30 animate-pulse"
          >
            [ CODE BLANK ]
          </span>
        );
      }
      if (targetWord && part.toLowerCase().includes(targetWord.toLowerCase())) {
        const subParts = part.split(new RegExp(`(${targetWord})`, "gi"));
        return subParts.map((sub, subIdx) =>
          sub.toLowerCase() === targetWord.toLowerCase() ? (
            <mark key={subIdx} className="rounded bg-amber-300/30 text-amber-200 px-1 py-0.5 font-bold">
              {sub}
            </mark>
          ) : (
            <span key={subIdx}>{sub}</span>
          ),
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-xl">
      {/* IDE Code Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2 text-xs font-bold text-slate-400">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </span>
          <span className="ml-2 font-mono text-[11px] text-slate-400">{isCodeType ? "Snippet.java" : "Passage"}</span>
        </div>
        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-extrabold text-indigo-400">
          {detectedLang}
        </span>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="overflow-x-auto p-4 font-mono text-sm leading-6">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, index) => (
              <tr key={index} className="hover:bg-slate-900/50">
                <td className="w-10 select-none pr-4 text-right font-mono text-xs font-semibold text-slate-600">
                  {index + 1}
                </td>
                <td className="whitespace-pre font-mono text-slate-200">
                  {renderHighlightedLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CodePassage;
