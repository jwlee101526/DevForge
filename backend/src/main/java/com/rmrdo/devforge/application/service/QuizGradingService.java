package com.rmrdo.devforge.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;
import com.rmrdo.devforge.domain.entity.QuizSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
/** 퀴즈 제출 답안 채점 및 점수 계산 전용 도메인 서비스 */
public class QuizGradingService {

    private final ObjectMapper objectMapper;

    public record GradeResult(
            int score,
            List<QuizGradeResponse.QuestionResultDto> results
    ) {}

    /** 퀴즈 세션의 정답 해설 JSON과 사용자의 제출 답안을 채점하여 결과를 생성한다. */
    public GradeResult evaluateSubmission(QuizSession session, QuizGradeRequest request) {
        Map<String, Map<String, Object>> answerKeys = parseAnswerKeys(session.getAnswerKeyJson());
        Map<String, String> userChoiceMap = new HashMap<>();
        Map<String, String> userTextMap = new HashMap<>();

        if (request.answers() != null) {
            for (QuizGradeRequest.AnswerSubmission sub : request.answers()) {
                if (sub.questionId() != null) {
                    if (sub.choiceId() != null) userChoiceMap.put(sub.questionId(), sub.choiceId());
                    if (sub.textAnswer() != null) userTextMap.put(sub.questionId(), sub.textAnswer());
                }
            }
        }

        int score = 0;
        List<QuizGradeResponse.QuestionResultDto> results = new ArrayList<>();

        for (Map.Entry<String, Map<String, Object>> entry : answerKeys.entrySet()) {
            String qId = entry.getKey();
            Map<String, Object> keyData = entry.getValue();

            String qType = (String) keyData.get("question_type");
            String ansFormat = (String) keyData.getOrDefault("answer_format", "choice");
            String correctChoice = (String) keyData.get("correct_choice_id");
            String correctText = (String) keyData.get("correct_text");
            String exp = (String) keyData.get("explanation");

            String uChoice = userChoiceMap.get(qId);
            String uText = userTextMap.get(qId);

            boolean isCorrect = false;
            if ("choice".equalsIgnoreCase(ansFormat) || (correctChoice != null && !correctChoice.isBlank())) {
                isCorrect = correctChoice != null && correctChoice.equalsIgnoreCase(uChoice);
            } else if (correctText != null && !correctText.isBlank() && uText != null) {
                isCorrect = uText.trim().equalsIgnoreCase(correctText.trim());
            }

            if (isCorrect) score++;

            results.add(new QuizGradeResponse.QuestionResultDto(
                    qId,
                    isCorrect ? "correct" : "incorrect",
                    correctChoice,
                    correctText,
                    correctText == null ? List.of() : List.of(correctText),
                    exp,
                    exp,
                    Map.of(),
                    null,
                    !isCorrect,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
            ));
        }

        return new GradeResult(score, results);
    }

    private Map<String, Map<String, Object>> parseAnswerKeys(String answerKeyJson) {
        if (answerKeyJson == null || answerKeyJson.isBlank()) return Map.of();
        try {
            return objectMapper.readValue(answerKeyJson, new TypeReference<Map<String, Map<String, Object>>>() {});
        } catch (Exception e) {
            log.error("Failed to parse answer keys JSON", e);
            return Map.of();
        }
    }
}
