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
    <div className="h-full flex flex-col rounded-3xl bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-2">
        <div className="flex gap-8">
          {[
            { id: "practice", label: hasQuiz ? "문제 풀이" : "퀴즈 설정" },
            { id: "stats", label: "학습 리포트" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id as "practice" | "stats")}
              className={`relative h-11 text-base font-extrabold transition ${
                activeView === item.id
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-800"
              }`}
            >
              {item.label}
              {activeView === item.id && (
                <span className="absolute inset-x-0 -bottom-2 h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {message && !hasQuiz && (
        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
          {message}
        </div>
      )}

      <div className="flex-1 mt-6">
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
