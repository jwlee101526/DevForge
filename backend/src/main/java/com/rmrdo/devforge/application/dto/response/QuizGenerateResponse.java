package com.rmrdo.devforge.application.dto.response;

import java.util.List;

public record QuizGenerateResponse(
        List<QuestionDto> questions,
        String answerToken
) {
}
