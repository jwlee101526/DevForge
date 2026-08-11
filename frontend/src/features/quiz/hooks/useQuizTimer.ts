import { useEffect, useState } from "react";

export function useQuizTimer(genLoading: boolean, generationStartedAt: number | null) {
  const [generationNow, setGenerationNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!genLoading) return undefined;
    const timer = window.setInterval(() => setGenerationNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [genLoading]);

  const generationElapsedMs = generationStartedAt ? Math.max(0, generationNow - generationStartedAt) : 0;
  const generationElapsedSeconds = Math.floor(generationElapsedMs / 1000);
  const generationStep =
    generationElapsedMs >= 24_000
      ? 4
      : generationElapsedMs >= 14_000
        ? 3
        : generationElapsedMs >= 6_000
          ? 2
          : generationElapsedMs >= 2_000
            ? 1
            : 0;

  return {
    generationStep,
    generationElapsedSeconds,
  };
}
