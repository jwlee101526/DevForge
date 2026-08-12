package com.rmrdo.devforge.application.dto.request;

import java.util.List;
import java.util.Map;

public record QuizGenerateRequest(
        String mode,
        String tag,
        boolean scopeAll,
        List<String> scopeTags,
        boolean scopeSavedDate,
        boolean scopeDue,
        String savedFrom,
        String savedTo,
        String instruction,
        int questionCount,
        Map<String, Integer> questionTypeCounts,
        List<String> techStacks,
        String difficulty
) {
    public QuizGenerateRequest {
        if (mode == null) mode = "random";
        if (tag == null) tag = "";
        if (questionCount <= 0) questionCount = 10;
        if (difficulty == null || difficulty.isBlank()) difficulty = "medium";
    }
}
