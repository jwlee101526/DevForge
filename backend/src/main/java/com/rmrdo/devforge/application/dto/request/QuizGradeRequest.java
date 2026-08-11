package com.rmrdo.devforge.application.dto.request;

import java.util.List;

public record QuizGradeRequest(
        String answerToken,
        List<AnswerSubmission> answers
) {
    public record AnswerSubmission(
            String questionId,
            String choiceId,
            String textAnswer
    ) {}
}
