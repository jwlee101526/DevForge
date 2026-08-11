package com.rmrdo.devforge.application.dto.response;

public record ConceptItemDto(
        String id,
        String word,
        String tag,
        String createdAt,
        String nextReview,
        int attemptCount,
        int incorrectCount,
        double accuracy,
        double incorrectRate
) {
}
