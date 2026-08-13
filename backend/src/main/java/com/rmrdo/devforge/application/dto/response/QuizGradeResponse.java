package com.rmrdo.devforge.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

/**
 * 퀴즈 채점 결과를 전달하는 DTO 클래스.
 */
public record QuizGradeResponse(
        @JsonProperty("session_id") String sessionId,
        @JsonProperty("score") int score,
        @JsonProperty("type_stats") Map<String, TypeStatDto> typeStats,
        @JsonProperty("results") List<QuestionResultDto> results
) {
    public record TypeStatDto(
            @JsonProperty("accuracy") double accuracy,
            @JsonProperty("count") int count
    ) {}

    public record QuestionResultDto(
            @JsonProperty("question_id") String questionId,
            @JsonProperty("status") String status,
            @JsonProperty("correct_choice_id") String correctChoiceId,
            @JsonProperty("correct_text") String correctText,
            @JsonProperty("acceptable_answers") List<String> acceptableAnswers,
            @JsonProperty("explanation") String explanation,
            @JsonProperty("answer_explanation") String answerExplanation,
            @JsonProperty("choice_explanations") Map<String, String> choiceExplanations,
            @JsonProperty("study_note") String studyNote,
            @JsonProperty("can_add_to_wordbook") Boolean canAddToWordbook,
            @JsonProperty("suggested_word") String suggestedWord,
            @JsonProperty("suggested_korean") String suggestedKorean,
            @JsonProperty("suggested_english_def") String suggestedEnglishDef,
            @JsonProperty("suggested_example") String suggestedExample,
            @JsonProperty("suggested_tag") String suggestedTag,
            @JsonProperty("target_word") String targetWord,
            @JsonProperty("source_word") String sourceWord
    ) {}
}
