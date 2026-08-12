import type { QuizGoal, QuizItem } from "../types/quiz";
import { countByTag, DEFAULT_QUESTION_TYPE_COUNTS, isDue, isInSavedRange } from "../utils/quizUtils";

export interface UseQuizSetupStateProps {
  goal: QuizGoal;
  setGoalValue: (key: string, value: unknown) => void;
  labels?: string[];
  words?: QuizItem[];
}

const MAX_QUESTION_COUNT = 10;

export function useQuizSetupState({
  goal,
  setGoalValue,
  labels = [],
  words = [],
}: UseQuizSetupStateProps) {
  const totalItems = words.length;
  const dueItems = words.filter(isDue);
  const rangeItems = words.filter((item) => isInSavedRange(item, goal.saved_from, goal.saved_to));
  const selectedTags = Array.isArray(goal.scope_tags) ? goal.scope_tags : [];
  const selectedItemsById = new Map<string, QuizItem>();

  if (goal.scope_all) {
    words.forEach((item) => selectedItemsById.set(item.id || item.word || "", item));
  }
  selectedTags.forEach((tag) => {
    words
      .filter((item) => (item.tag || "미지정") === tag)
      .forEach((item) => selectedItemsById.set(item.id || item.word || "", item));
  });
  if (goal.scope_saved_date) {
    rangeItems.forEach((item) => selectedItemsById.set(item.id || item.word || "", item));
  }
  if (goal.scope_due) {
    dueItems.forEach((item) => selectedItemsById.set(item.id || item.word || "", item));
  }
  const selectedItemCount = selectedItemsById.size;
  const itemTags = Array.from(new Set(words.map((item) => item.tag || "미지정").filter(Boolean)));
  const visibleLabels = [
    ...labels.filter((label) => itemTags.includes(label)),
    ...itemTags.filter((tag) => !labels.includes(tag)),
  ];

  const syncMode = (nextGoal: Partial<QuizGoal>): "random" | "tag" | "saved_date" | "custom" => {
    if (nextGoal.scope_all) return "random";
    if (nextGoal.scope_tags?.length === 1 && !nextGoal.scope_saved_date && !nextGoal.scope_due) return "tag";
    if (!nextGoal.scope_tags?.length && nextGoal.scope_saved_date && !nextGoal.scope_due) return "saved_date";
    return "custom";
  };

  const updateScope = (patch: Partial<QuizGoal>) => {
    const nextGoal = { ...goal, ...patch };
    if (patch.scope_all === true) {
      nextGoal.scope_tags = [];
      nextGoal.scope_saved_date = false;
      nextGoal.scope_due = false;
    }
    if (
      (patch.scope_tags && patch.scope_tags.length > 0) ||
      patch.scope_saved_date === true ||
      patch.scope_due === true
    ) {
      nextGoal.scope_all = false;
    }
    setGoalValue("scope_all", Boolean(nextGoal.scope_all));
    setGoalValue("scope_tags", nextGoal.scope_tags || []);
    setGoalValue("scope_saved_date", Boolean(nextGoal.scope_saved_date));
    setGoalValue("scope_due", Boolean(nextGoal.scope_due));
    setGoalValue("tag", nextGoal.scope_tags?.[0] || "");
    setGoalValue("mode", syncMode(nextGoal));
  };

  const toggleTag = (label: string) => {
    const nextTags = selectedTags.includes(label)
      ? selectedTags.filter((item) => item !== label)
      : [...selectedTags, label];
    updateScope({ scope_tags: nextTags });
  };

  const hasTypeCounts = Object.keys(goal.question_type_counts || {}).length > 0;
  const questionTypeCounts = hasTypeCounts ? goal.question_type_counts : DEFAULT_QUESTION_TYPE_COUNTS;
  const totalQuestionCount = Object.values(questionTypeCounts).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );

  const setQuestionTypeCount = (key: string, value: unknown) => {
    const digits = String(value).replace(/\D/g, "");
    const current = Number(questionTypeCounts[key] || 0);
    const otherTotal = Math.max(0, totalQuestionCount - current);
    if (!digits) {
      const nextCounts = { ...questionTypeCounts, [key]: 0 };
      setGoalValue("question_type_counts", nextCounts);
      setGoalValue("question_count", Object.values(nextCounts).reduce((sum, item) => sum + Number(item || 0), 0));
      return;
    }
    const nextValue = Math.min(MAX_QUESTION_COUNT - otherTotal, Math.max(0, Number(digits)));
    const nextCounts = { ...questionTypeCounts, [key]: nextValue };
    setGoalValue("question_type_counts", nextCounts);
    setGoalValue("question_count", Object.values(nextCounts).reduce((sum, item) => sum + Number(item || 0), 0));
  };

  return {
    totalItems,
    dueItems,
    rangeItems,
    selectedTags,
    selectedItemCount,
    visibleLabels,
    updateScope,
    toggleTag,
    questionTypeCounts,
    totalQuestionCount,
    setQuestionTypeCount,
    countByTag: (tag: string) => countByTag(words, tag),
  };
}
