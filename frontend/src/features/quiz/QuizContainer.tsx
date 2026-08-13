import React from "react";
import { QuizPracticeView } from "./components/practice/QuizPracticeView";
import { QuizSetupView } from "./components/setup/QuizSetupView";
import { useQuiz, type UseQuizOptions } from "./hooks/useQuiz";
import type { QuestionResult } from "./types/quiz";

export type QuizContainerProps = UseQuizOptions;

export const QuizContainer: React.FC<QuizContainerProps> = (props) => {
  const {
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
    generate,
    grade,
    genLoading,
    gradeLoading,
    generationStep,
    generationElapsedSeconds,
    resetQuiz,
    saveSuggestedConceptMutation,
    savedSuggestedWords,
    errorMessage,
    message,
    hasQuiz,
    user,
  } = useQuiz(props);

  return (
    <div className="h-full flex flex-col rounded-3xl bg-white p-6 shadow-sm">
      {errorMessage && (
        <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {message && !hasQuiz && (
        <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
          {message}
        </div>
      )}

      <div className="flex-1">
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
      </div>
    </div>
  );
};

export default QuizContainer;
