package com.rmrdo.devforge.application.dto.response;

import java.util.List;

public record QuestionDto(
        String id,
        String questionType,
        String difficulty,
        String prompt,
        String passage,
        String targetWord,
        String answerFormat,
        List<ChoiceDto> choices
) {
}
