package com.rmrdo.devforge.application.port;

import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;

import java.util.Map;

public interface AiQuizGenerator {
    String getProviderName();
    QuizGenerateResponse generateQuiz(QuizGenerateRequest request);
    QuizGradeResponse gradeQuiz(QuizGradeRequest request);
    boolean isAvailable();

    default Map<String, Object> getStatus() {
        return Map.of(
                "name", getProviderName(),
                "available", isAvailable()
        );
    }
}
