package com.rmrdo.devforge.application.dto.response;

import java.util.List;

public record QuizStatsResponse(
        StatsSummaryDto summary,
        List<ConceptStatDto> wordStats,
        List<SessionSummaryDto> recentSessions
) {
    public record StatsSummaryDto(
            int attemptCount
    ) {}

    public record ConceptStatDto(
            String word,
            int attemptCount,
            int incorrectCount,
            double incorrectRate,
            double accuracy
    ) {}

    public record SessionSummaryDto(
            String id,
            int totalQuestions,
            int score,
            String tag,
            String completedAt
    ) {}
}
