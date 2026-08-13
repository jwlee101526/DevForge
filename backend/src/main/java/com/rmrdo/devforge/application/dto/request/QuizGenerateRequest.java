package com.rmrdo.devforge.application.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

/**
 * AI 퀴즈 생성 요청 DTO.
 * 프론트엔드의 snake_case JSON 프로퍼티를 자바 record 필드와 바인딩한다.
 */
public record QuizGenerateRequest(
        @JsonProperty("mode") String mode,
        @JsonProperty("tag") String tag,
        @JsonProperty("scope_all") boolean scopeAll,
        @JsonProperty("scope_tags") List<String> scopeTags,
        @JsonProperty("scope_saved_date") boolean scopeSavedDate,
        @JsonProperty("scope_due") boolean scopeDue,
        @JsonProperty("saved_from") String savedFrom,
        @JsonProperty("saved_to") String savedTo,
        @JsonProperty("instruction") String instruction,
        @JsonProperty("question_count") int questionCount,
        @JsonProperty("question_type_counts") Map<String, Integer> questionTypeCounts,
        @JsonProperty("tech_stacks") List<String> techStacks,
        @JsonProperty("difficulty") String difficulty
) {
    public QuizGenerateRequest {
        if (mode == null) mode = "random";
        if (tag == null) tag = "";
        if (questionCount <= 0) questionCount = 10;
        if (difficulty == null || difficulty.isBlank()) difficulty = "medium";
    }
}
