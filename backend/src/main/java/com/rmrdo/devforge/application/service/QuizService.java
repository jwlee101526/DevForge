package com.rmrdo.devforge.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.response.QuestionDto;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;
import com.rmrdo.devforge.application.port.AiProviderFactory;
import com.rmrdo.devforge.application.port.AiQuizGenerator;
import com.rmrdo.devforge.domain.entity.QuizSession;
import com.rmrdo.devforge.infrastructure.persistence.QuizSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
/** 퀴즈 생성, 세션 저장, 답안 채점의 애플리케이션 로직을 담당한다. */
public class QuizService {

    private final AiProviderFactory providerFactory;
    private final QuizSessionRepository sessionRepository;
    private final ObjectMapper objectMapper;
    private final WeaknessService weaknessService;
    private final QuizGradingService quizGradingService;

    @Transactional
    public QuizGenerateResponse generateQuiz(QuizGenerateRequest request) {
        return generateQuiz(request, null);
    }

    @Transactional
    /** AI 생성 결과와 외부에 노출하지 않을 정답 정보를 세션에 저장한다. */
    public QuizGenerateResponse generateQuiz(QuizGenerateRequest request, UUID userId) {
        AiQuizGenerator provider = providerFactory.getAvailableProvider();
        QuizGenerateResponse result = provider.generateQuiz(request);

        String tag = (request.scopeTags() != null && !request.scopeTags().isEmpty())
                ? request.scopeTags().get(0)
                : request.tag();

        QuizSession session = new QuizSession();
        session.setUserId(userId);
        session.setScope("PERSONAL");
        session.setTotalQuestions(result.questions() != null ? result.questions().size() : 0);
        session.setTag(tag);
        try {
            session.setQuestionsJson(objectMapper.writeValueAsString(result.questions()));
            session.setAnswerKeyJson(result.answerToken());
        } catch (Exception e) {
            log.error("Failed to serialize questions to JSON", e);
            session.setQuestionsJson("[]");
        }
        session.setAnswerToken(generateSessionToken());

        QuizSession savedSession = sessionRepository.save(session);

        String token = (savedSession.getAnswerToken() != null)
                ? savedSession.getAnswerToken()
                : savedSession.getId().toString();

        return new QuizGenerateResponse(result.questions(), token);
    }

    @Transactional
    /** 세션 정답 정보가 있으면 서버에서 직접 채점하고 결과를 저장한다. */
    public QuizGradeResponse gradeQuiz(QuizGradeRequest request) {
        LocalDateTime from = LocalDateTime.now().minusHours(24);
        LocalDateTime to = LocalDateTime.now().plusDays(1);
        List<QuizSession> sessions = sessionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(from, to, org.springframework.data.domain.Pageable.unpaged());

        QuizSession targetSession = sessions.stream()
                .filter(s -> Objects.equals(s.getAnswerToken(), request.answerToken()))
                .findFirst()
                .orElse(null);

        QuizGradeResponse result;
        if (targetSession != null && hasText(targetSession.getAnswerKeyJson())) {
            // 생성 시 저장한 정답을 사용해 AI 응답 형식에 영향을 받지 않도록 채점한다.
            result = gradeFromStoredAnswerKey(targetSession, request);
        } else {
            // 정답 정보가 없는 기존 세션은 호환성을 위해 AI 채점으로 처리한다.
            AiQuizGenerator provider = providerFactory.getAvailableProvider();
            result = provider.gradeQuiz(request);
        }

        String sessionIdStr = null;
        if (targetSession != null) {
            targetSession.setScore(result.score());
            try {
                targetSession.setAnswersJson(objectMapper.writeValueAsString(request.answers()));
                targetSession.setGradeResultJson(objectMapper.writeValueAsString(result));
            } catch (Exception e) {
                log.error("Failed to serialize grade results for session {}", targetSession.getId(), e);
            }
            targetSession.setCompletedAt(LocalDateTime.now());
            sessionRepository.save(targetSession);
            sessionIdStr = targetSession.getId().toString();

            /** 채점 후 오답 개념 및 키워드를 집계하여 사용자 약점 데이터를 수집·업데이트한다. */
            weaknessService.recordQuizResults(targetSession, result);
        }

        return new QuizGradeResponse(sessionIdStr, result.score(), result.typeStats(), result.results());
    }

    private QuizGradeResponse gradeFromStoredAnswerKey(QuizSession session, QuizGradeRequest request) {
        // 문제 목록과 숨겨진 정답 키를 조합해 문제 유형별 통계까지 계산한다.
        try {
            JsonNode answerKey = objectMapper.readTree(session.getAnswerKeyJson());
            List<QuestionDto> questions = objectMapper.readValue(session.getQuestionsJson(), new TypeReference<List<QuestionDto>>() {});
            Map<String, QuestionDto> questionMap = new LinkedHashMap<>();
            for (QuestionDto question : questions) {
                questionMap.put(question.id(), question);
            }

            Map<String, QuizGradeRequest.AnswerSubmission> answerMap = new HashMap<>();
            if (request.answers() != null) {
                for (QuizGradeRequest.AnswerSubmission answer : request.answers()) {
                    answerMap.put(answer.questionId(), answer);
                }
            }

            List<QuizGradeResponse.QuestionResultDto> results = new ArrayList<>();
            Map<String, StatCounter> typeStats = new LinkedHashMap<>();
            int correctCount = 0;

            for (QuestionDto question : questions) {
                JsonNode key = answerKey.path(question.id());
                QuizGradeRequest.AnswerSubmission answer = answerMap.get(question.id());
                String questionType = nonBlank(question.questionType(), "meaning_choice");
                StatCounter stat = typeStats.computeIfAbsent(questionType, ignored -> new StatCounter());
                stat.count++;

                String correctChoiceId = text(key, "correct_choice_id");
                String correctText = text(key, "correct_text");
                String explanation = nonBlank(text(key, "explanation"), "저장된 정답 기준으로 채점했습니다.");
                boolean correct = isCorrect(question, answer, correctChoiceId, correctText);
                if (correct) {
                    correctCount++;
                    stat.correct++;
                }

                String answerExplanation = explanation;
                if (!correct) {
                    if ("choice".equals(question.answerFormat())) {
                        String userChoice = answer != null && answer.choiceId() != null && !answer.choiceId().isBlank() ? answer.choiceId() : "미제출";
                        answerExplanation = "제출하신 답변 [" + userChoice + "]번은 오답입니다. (정답: " + correctChoiceId + "번)\n" + explanation;
                    } else {
                        String userText = answer != null && answer.textAnswer() != null && !answer.textAnswer().isBlank() ? answer.textAnswer() : "미제출";
                        answerExplanation = "작성하신 답변 '" + userText + "'은(는) 요구하는 정답과 일치하지 않는 오답입니다.\n정답: " + (correctText != null ? correctText : "지정 정답") + "\n" + explanation;
                    }
                }

                results.add(new QuizGradeResponse.QuestionResultDto(
                        question.id(),
                        correct ? "correct" : "incorrect",
                        correctChoiceId,
                        correctText,
                        correctText == null ? List.of() : List.of(correctText),
                        explanation,
                        answerExplanation,
                        Map.of(),
                        null,
                        !correct,
                        !correct ? question.targetWord() : null,
                        !correct ? question.prompt() : null,
                        null,
                        null,
                        !correct ? question.questionType() : null,
                        question.targetWord(),
                        question.targetWord()
                ));
            }

            Map<String, QuizGradeResponse.TypeStatDto> stats = new LinkedHashMap<>();
            typeStats.forEach((type, stat) -> stats.put(type, new QuizGradeResponse.TypeStatDto(
                    stat.count == 0 ? 0.0 : (double) stat.correct / stat.count,
                    stat.count
            )));

            return new QuizGradeResponse(session.getId().toString(), correctCount, stats, results);
        } catch (Exception e) {
            throw new RuntimeException("저장된 정답 정보를 읽을 수 없습니다. 다시 생성 후 채점해 주세요.", e);
        }
    }

    private boolean isCorrect(QuestionDto question, QuizGradeRequest.AnswerSubmission answer, String correctChoiceId, String correctText) {
        if (answer == null) {
            return false;
        }
        if ("choice".equals(question.answerFormat())) {
            return hasText(correctChoiceId) && correctChoiceId.equalsIgnoreCase(nonBlank(answer.choiceId(), ""));
        }
        return hasText(correctText) && normalize(correctText).equals(normalize(answer.textAnswer()));
    }

    private String text(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        return value != null && !value.isNull() ? value.asText(null) : null;
    }

    private String nonBlank(String value, String fallback) {
        return hasText(value) ? value : fallback;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private String normalize(String value) {
        return value == null ? "" : value.replaceAll("\\s+", " ").trim().toLowerCase(Locale.ROOT);
    }

    private static class StatCounter {
        private int correct;
        private int count;
    }

    @Transactional(readOnly = true)
    /** 세션에 저장된 문제와 제출 답안, 채점 결과를 조회한다. 소유권 검증을 통해 타 사용자 데이터 접근을 차단한다. */
    public Map<String, Object> getSession(UUID id, UUID requestingUserId) {
        QuizSession session = sessionRepository.findById(id).orElse(null);
        if (session == null) {
            return null;
        }

        /** 개인 사용자가 지정된 세션의 경우 요청 사용자 ID와 일치하지 않으면 접근을 차단한다. */
        if (session.getUserId() != null && !session.getUserId().equals(requestingUserId)) {
            return null;
        }

        Map<String, Object> response = new HashMap<>();
        try {
            if (session.getQuestionsJson() != null) {
                response.put("questions", objectMapper.readValue(session.getQuestionsJson(), new TypeReference<List<QuestionDto>>() {}));
            }
            if (session.getAnswersJson() != null) {
                response.put("answers", objectMapper.readValue(session.getAnswersJson(), new TypeReference<Object>() {}));
            }
            if (session.getGradeResultJson() != null) {
                response.put("grade_result", objectMapper.readValue(session.getGradeResultJson(), QuizGradeResponse.class));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize session data", e);
        }

        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSession(UUID id) {
        return getSession(id, null);
    }

    private String generateSessionToken() {
        return "st_" + UUID.randomUUID().toString().replace("-", "").substring(0, 21);
    }
}
