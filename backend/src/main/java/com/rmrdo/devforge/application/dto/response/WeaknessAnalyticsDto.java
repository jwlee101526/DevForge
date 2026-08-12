package com.rmrdo.devforge.application.dto.response;

import java.util.List;

/** 사용자가 자주 틀리는 개념, 키워드, 문제 유형에 대한 약점 분석 데이터 DTO */
public record WeaknessAnalyticsDto(
        int totalAttemptedCount,
        int totalIncorrectCount,
        double overallIncorrectRate,
        List<WeaknessConceptDto> frequentIncorrectConcepts,
        List<WeaknessTypeDto> weakQuestionTypes,
        List<String> recommendedReviewKeywords
) {
    public record WeaknessConceptDto(
            String word,
            String korean,
            String tag,
            int attemptCount,
            int incorrectCount,
            double incorrectRate,
            double accuracy
    ) {}

    public record WeaknessTypeDto(
            String questionType,
            String label,
            int count,
            int incorrectCount,
            double incorrectRate
    ) {}
}
