export interface QuestionTypeCounts {
  meaning_choice: number;
  context_choice: number;
  collocation_choice: number;
  usage_choice: number;
  short_answer: number;
  sentence_answer: number;
  [key: string]: number;
}

export type QuizMode = "random" | "tag" | "saved_date" | "custom";

export interface QuizGoal {
  mode: QuizMode;
  tag: string;
  scope_all: boolean;
  scope_tags: string[];
  scope_saved_date: boolean;
  scope_due: boolean;
  saved_from: string;
  saved_to: string;
  instruction: string;
  question_count: number;
  question_type_counts: QuestionTypeCounts;
}

export interface Choice {
  id: string;
  text: string;
}

export type QuestionDifficulty = "easy" | "medium" | "hard" | "challenge" | string;
export type QuestionAnswerFormat = "choice" | "text" | string;

export interface Question {
  id: string;
  question_type: string;
  difficulty: QuestionDifficulty;
  prompt: string;
  passage?: string;
  target_word?: string;
  answer_format: QuestionAnswerFormat;
  choices: Choice[];
}

export interface UserAnswer {
  choice_id?: string;
  text_answer?: string;
}

export interface UserAnswerSubmission extends UserAnswer {
  question_id?: string;
  questionId?: string;
  choiceId?: string;
  textAnswer?: string;
}

export type ResultStatus = "correct" | "partial" | "incorrect";

export interface QuestionResult {
  question_id: string;
  status: ResultStatus;
  correct_choice_id?: string;
  correct_text?: string;
  acceptable_answers?: string[];
  explanation?: string;
  answer_explanation?: string;
  choice_explanations?: Record<string, string>;
  study_note?: string;
  can_add_to_wordbook?: boolean;
  suggested_word?: string;
  suggested_korean?: string;
  suggested_english_def?: string;
  suggested_example?: string;
  suggested_tag?: string;
  target_word?: string;
  source_word?: string;
}

export interface TypeStat {
  accuracy: number;
  count: number;
}

export interface GradeResult {
  session_id?: string;
  score?: number;
  type_stats?: Record<string, TypeStat>;
  results?: QuestionResult[];
  review_schedule_applied?: boolean;
}

export interface QuizItem {
  id?: string;
  word?: string;
  concept?: string;
  tag?: string;
  created_at?: string;
  next_review?: string;
  attempt_count?: number;
  incorrect_count?: number;
  accuracy?: number;
  incorrect_rate?: number;
  last_quiz_at?: string;
  [key: string]: unknown;
}

export interface QuizSessionSummary {
  id: string;
  total_questions?: number;
  question_count?: number;
  score?: number;
  tag?: string;
  completed_at?: string;
  created_at?: string;
}

export interface StatsRange {
  preset: "week" | "month" | "quarter" | "custom" | string;
  startDate: string;
  endDate: string;
}

export interface QuizStatsData {
  summary?: {
    attempt_count?: number;
    [key: string]: unknown;
  };
  word_stats?: QuizItem[];
  recent_sessions?: QuizSessionSummary[];
}

export interface UserInfo {
  id: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}
