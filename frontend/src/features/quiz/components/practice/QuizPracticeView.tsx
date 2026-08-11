import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useQuizPracticeState } from "../../hooks/useQuizPracticeState";
import type { GradeResult, Question, QuestionResult, UserAnswer } from "../../types/quiz";
import { HighlightedPassage } from "./HighlightedPassage";
import { QuestionChoiceList } from "./QuestionChoiceList";
import { QuestionList } from "./QuestionList";
import { QuizPracticeFooterNav } from "./QuizPracticeFooterNav";
import { QuizPracticeHeader } from "./QuizPracticeHeader";
import { ResultExplanation } from "./ResultExplanation";
import { SuggestedConceptInline } from "./SuggestedConceptInline";

export interface QuizPracticeViewProps {
  questions: Question[];
  answers: Record<string, UserAnswer>;
  chooseAnswer: (questionId: string, choiceId: string) => void;
  typeTextAnswer: (questionId: string, value: string) => void;
  gradeResult: GradeResult | null;
  resultByQuestion: Record<string, QuestionResult>;
  currentIndex?: number;
  setCurrentIndex?: (value: number | ((prev: number) => number)) => void;
  onGrade: () => void;
  gradeLoading?: boolean;
  onResetQuiz: () => void;
  onSaveSuggestedWord?: (result: QuestionResult) => void;
  savingSuggestedWord?: string;
  savedSuggestedWords?: Set<string>;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "기초",
  medium: "응용",
  hard: "심화",
  challenge: "도전",
};

const TYPE_LABELS: Record<string, string> = {
  meaning_choice: "개념/용어",
  context_choice: "코드 빈칸",
  collocation_choice: "키워드/구문",
  usage_choice: "코드/로직",
  short_answer: "단답형",
  sentence_answer: "코드/서술형",
};

function normalizeQuestionType(type: string): string {
  if (type === "grammar_blank_choice") return "context_choice";
  return type;
}

function questionTypeLabel(type: string): string {
  return TYPE_LABELS[normalizeQuestionType(type)] || type;
}

function userAnswerLabel(question: Question, answer: UserAnswer): string {
  if (question.answer_format === "choice") {
    const selectedChoice = question.choices.find((choice) => choice.id === answer.choice_id);
    if (!selectedChoice) return "미선택";
    return selectedChoice.text.trim().startsWith(`${selectedChoice.id}.`)
      ? selectedChoice.text
      : `${selectedChoice.id}. ${selectedChoice.text}`;
  }
  return (answer.text_answer || "").trim() || "미입력";
}

export const QuizPracticeView: React.FC<QuizPracticeViewProps> = ({
  questions,
  answers,
  chooseAnswer,
  typeTextAnswer,
  gradeResult,
  resultByQuestion,
  currentIndex = 0,
  setCurrentIndex,
  onGrade,
  gradeLoading,
  onResetQuiz,
  onSaveSuggestedWord,
  savingSuggestedWord = "",
  savedSuggestedWords,
}) => {
  const {
    safeIndex,
    question,
    answer,
    result,
    progressPercent,
    canGoPrev,
    canGoNext,
    isLastQuestion,
    canSubmit,
    setIndex,
  } = useQuizPracticeState({
    questions,
    answers,
    resultByQuestion,
    currentIndex,
    setCurrentIndex,
    hasGradeResult: Boolean(gradeResult),
  });

  if (!question) return null;

  const normalizedType = normalizeQuestionType(question.question_type);
  const difficulty = question.difficulty;
  const count = difficulty === "easy" ? 2 : difficulty === "medium" ? 3 : difficulty === "hard" ? 4 : 5;
  const stars = Array.from({ length: 5 }, (_, index) => index < count);

  return (
    <div className="animate-fadeIn grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
      <main className="min-w-0 space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white">
          <QuizPracticeHeader
            safeIndex={safeIndex}
            totalQuestions={questions.length}
            progressPercent={progressPercent}
            hasGradeResult={Boolean(gradeResult)}
            onResetQuiz={onResetQuiz}
          />

          <CardContent className="p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-full bg-[#14532d] px-4 py-1.5 text-xs font-black text-white hover:bg-[#14532d]">
                  {questionTypeLabel(question.question_type)}
                </Badge>
                <span className="text-sm font-bold text-slate-600">난이도</span>
                <span className="flex items-center gap-0.5">
                  {stars.map((active, index) => (
                    <HugeiconsIcon
                      key={index}
                      icon={StarIcon}
                      className={cn(
                        "h-4 w-4",
                        active ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200",
                      )}
                    />
                  ))}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {DIFFICULTY_LABELS[question.difficulty] || question.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-black leading-8 text-slate-950">
                {question.prompt}
              </h3>
              {question.passage && (
                <div className="border-y border-slate-200 py-5">
                  <pre className="font-mono text-sm leading-6 text-slate-950 overflow-x-auto whitespace-pre-wrap bg-slate-50 p-4 rounded-md">
                    <HighlightedPassage
                      text={question.passage}
                      target={question.target_word}
                      active={normalizedType === "meaning_choice"}
                    />
                  </pre>
                </div>
              )}

              {question.answer_format === "choice" ? (
                <QuestionChoiceList
                  questionId={question.id}
                  choices={question.choices}
                  answer={answer}
                  result={result}
                  hasGradeResult={Boolean(gradeResult)}
                  chooseAnswer={chooseAnswer}
                />
              ) : (
                <Textarea
                  rows={normalizedType === "sentence_answer" ? 5 : 3}
                  value={answer.text_answer || ""}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => typeTextAnswer(question.id, event.target.value)}
                  disabled={Boolean(gradeResult)}
                  placeholder={
                    normalizedType === "sentence_answer"
                      ? "정답 코드 또는 기술 설명 서술형 답변을 입력하세요."
                      : "정답 명령어/키워드를 직접 입력하세요."
                  }
                  className="rounded-md border-slate-200 text-base leading-7 focus-visible:ring-[#14532d] disabled:bg-white disabled:opacity-100 font-mono"
                />
              )}

              {gradeResult && (
                <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-black text-slate-500">내 답</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-950">
                    {userAnswerLabel(question, answer)}
                  </p>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-8 rounded-md border border-slate-200 bg-slate-50/70 p-4">
                <ResultExplanation result={result} />
                <SuggestedConceptInline
                  result={result}
                  questionNumber={safeIndex + 1}
                  onSaveSuggestedWord={onSaveSuggestedWord}
                  savingWord={savingSuggestedWord}
                  savedWords={savedSuggestedWords}
                />
              </div>
            )}

            <QuizPracticeFooterNav
              canGoPrev={canGoPrev}
              canGoNext={canGoNext}
              isLastQuestion={isLastQuestion}
              canSubmit={canSubmit}
              hasGradeResult={Boolean(gradeResult)}
              gradeLoading={gradeLoading}
              onPrev={() => setIndex(safeIndex - 1)}
              onNext={() => setIndex(safeIndex + 1)}
              onGrade={onGrade}
            />
          </CardContent>
        </div>
      </main>

      <QuestionList
        questions={questions}
        answers={answers}
        resultByQuestion={resultByQuestion}
        currentIndex={safeIndex}
        onSelect={setIndex}
      />
    </div>
  );
};

export default QuizPracticeView;
