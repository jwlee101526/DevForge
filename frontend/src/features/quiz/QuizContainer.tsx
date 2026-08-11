import React from "react";
import { QuizPracticeView } from "./components/practice/QuizPracticeView";
import { QuizSetupView } from "./components/setup/QuizSetupView";
import { QuizStatsPanel } from "./components/stats/QuizStatsPanel";
import { useQuiz, type UseQuizOptions } from "./hooks/useQuiz";
import type { QuestionResult } from "./types/quiz";

export type QuizContainerProps = UseQuizOptions;

export const QuizContainer: React.FC<QuizContainerProps> = (props) => {
  const {
    activeView,
    setActiveView,
    goal,
    setGoalValue,
    questions,
    answers,
    chooseAnswer,
    typeTextAnswer,
    gradeResult,
    resultByQuestion,
    currentIndex,
    setCurrentIndex,
    labels,
    words,
    statsQuery,
    statsRange,
    setStatsRange,
    generate,
    grade,
    genLoading,
    gradeLoading,
    generationStep,
    generationElapsedSeconds,
    resetQuiz,
    openSessionMutation,
    saveSuggestedConceptMutation,
    savedSuggestedWords,
    errorMessage,
    message,
    hasQuiz,
    user,
  } = useQuiz(props);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          {[
            { id: "practice", label: hasQuiz ? "문제 풀이" : "퀴즈 설정" },
            { id: "stats", label: "학습 리포트" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id as "practice" | "stats")}
              className={`relative h-11 text-sm font-black transition ${
                activeView === item.id
                  ? "text-[#0f766e]"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item.label}
              {activeView === item.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#0f766e]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-xs font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {message && !hasQuiz && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-600">
          {message}
        </div>
      )}

      <div className="flex-1 mt-5">
        {activeView === "stats" ? (
          <QuizStatsPanel
            statsQuery={statsQuery}
            range={statsRange}
            onRangeChange={setStatsRange}
            onOpenSession={(sessionId) => openSessionMutation.mutate(sessionId)}
            openingSessionId={openSessionMutation.isPending ? (openSessionMutation.variables as string) : null}
          />
        ) : (
          <div className="h-full">
            {!hasQuiz ? (
              <QuizSetupView
                goal={goal}
                setGoalValue={setGoalValue}
                labels={labels}
                words={words}
                onGenerate={generate}
                disabled={genLoading}
                loading={genLoading}
                generationStep={generationStep}
                generationElapsedSeconds={generationElapsedSeconds}
                user={user}
              />
            ) : (
              <QuizPracticeView
                questions={questions}
                answers={answers}
                chooseAnswer={chooseAnswer}
                typeTextAnswer={typeTextAnswer}
                gradeResult={gradeResult}
                resultByQuestion={resultByQuestion}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                onGrade={grade}
                gradeLoading={gradeLoading}
                onResetQuiz={resetQuiz}
                onSaveSuggestedWord={(result: QuestionResult) => saveSuggestedConceptMutation.mutate(result)}
                savingSuggestedWord={
                  saveSuggestedConceptMutation.isPending
                    ? saveSuggestedConceptMutation.variables?.suggested_word || ""
                    : ""
                }
                savedSuggestedWords={savedSuggestedWords}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizContainer;
