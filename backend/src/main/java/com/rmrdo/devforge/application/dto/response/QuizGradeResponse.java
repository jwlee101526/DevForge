package com.rmrdo.devforge.application.dto.response;

import java.util.List;
import java.util.Map;

public record QuizGradeResponse(
        String sessionId,
        int score,
        Map<String, TypeStatDto> typeStats,
        List<QuestionResultDto> results
) {
    public record TypeStatDto(
            double accuracy,
            int count
    ) {}

    public record QuestionResultDto(
            String questionId,
            String status,
            String correctChoiceId,
            String correctText,
            List<String> acceptableAnswers,
            String explanation,
            String answerExplanation,
            Map<String, String> choiceExplanations,
            String studyNote,
            Boolean canAddToWordbook,
            String suggestedWord,
            String suggestedKorean,
            String suggestedEnglishDef,
            String suggestedExample,
            String suggestedTag,
            String targetWord,
            String sourceWord
    ) {}
}
