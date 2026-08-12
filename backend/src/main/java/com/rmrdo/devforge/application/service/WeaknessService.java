package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;
import com.rmrdo.devforge.application.dto.response.WeaknessAnalyticsDto;
import com.rmrdo.devforge.domain.entity.Concept;
import com.rmrdo.devforge.domain.entity.QuizSession;
import com.rmrdo.devforge.infrastructure.persistence.ConceptRepository;
import com.rmrdo.devforge.infrastructure.persistence.QuizSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
/** 사용자가 자주 틀리는 개념, 키워드, 문제 유형을 수집 및 집계하여 약점 분석 기능을 제공한다. */
public class WeaknessService {

    private final ConceptRepository conceptRepository;
    private final QuizSessionRepository sessionRepository;

    @Transactional
    /** 채점 결과에서 오답/부분정답 개념을 기록하여 약점 데이터를 갱신한다. */
    public void recordQuizResults(QuizSession session, QuizGradeResponse gradeResponse) {
        if (gradeResponse == null || gradeResponse.results() == null) return;

        UUID userId = session.getUserId();
        String defaultTag = session.getTag() != null ? session.getTag() : "개발공통";

        for (QuizGradeResponse.QuestionResultDto item : gradeResponse.results()) {
            String word = item.targetWord() != null && !item.targetWord().isBlank()
                    ? item.targetWord()
                    : item.suggestedWord();

            if (word == null || word.isBlank()) continue;

            boolean isIncorrect = "incorrect".equalsIgnoreCase(item.status()) || Boolean.TRUE.equals(item.canAddToWordbook());
            boolean isPartial = "partial".equalsIgnoreCase(item.status());

            Optional<Concept> existing = (userId != null)
                    ? conceptRepository.findByWordAndUserIdAndScope(word, userId, "PERSONAL")
                    : conceptRepository.findByWordAndScope(word, "PERSONAL");

            Concept concept;
            if (existing.isPresent()) {
                concept = existing.get();
            } else {
                concept = new Concept();
                concept.setUserId(userId);
                concept.setScope("PERSONAL");
                concept.setWord(word);
                concept.setKorean(item.suggestedKorean() != null ? item.suggestedKorean() : word);
                concept.setTag(item.suggestedTag() != null ? item.suggestedTag() : defaultTag);
            }

            concept.setAttemptCount(concept.getAttemptCount() + 1);
            if (isIncorrect || isPartial) {
                concept.setIncorrectCount(concept.getIncorrectCount() + 1);
            }
            concept.setLastQuizAt(LocalDateTime.now());
            concept.setNextReview(LocalDateTime.now().plusDays(isIncorrect ? 1 : 3));

            conceptRepository.save(concept);
        }
    }

    @Transactional(readOnly = true)
    /** 사용자별 자주 틀리는 약점 개념 및 문제 유형 분석 결과를 반환한다. */
    public WeaknessAnalyticsDto getWeaknessAnalytics(UUID userId) {
        List<Concept> concepts;
        if (userId != null) {
            concepts = conceptRepository.findByUserIdAndScopeOrderByCreatedAtDesc(userId, "PERSONAL");
        } else {
            concepts = List.of();
        }

        int totalAttempts = concepts.stream().mapToInt(Concept::getAttemptCount).sum();
        int totalIncorrects = concepts.stream().mapToInt(Concept::getIncorrectCount).sum();
        double overallRate = totalAttempts > 0 ? (double) totalIncorrects / totalAttempts : 0.0;

        // 자주 틀리는 개념 Top 15 (오답 수 1 이상)
        List<WeaknessAnalyticsDto.WeaknessConceptDto> topWeakConcepts = concepts.stream()
                .filter(c -> c.getIncorrectCount() > 0)
                .sorted(Comparator.comparingInt(Concept::getIncorrectCount).reversed())
                .limit(15)
                .map(c -> new WeaknessAnalyticsDto.WeaknessConceptDto(
                        c.getWord(),
                        c.getKorean(),
                        c.getTag(),
                        c.getAttemptCount(),
                        c.getIncorrectCount(),
                        c.getIncorrectRate(),
                        c.getAccuracy()
                )).toList();

        // 문제 유형별 약점 집계
        Map<String, int[]> typeMap = new HashMap<>(); // [total, incorrect]
        List<QuizSession> userSessions = (userId != null)
                ? sessionRepository.findByUserIdAndScopeAndCreatedAtBetweenOrderByCreatedAtDesc(
                        userId, "PERSONAL", LocalDateTime.now().minusMonths(3), LocalDateTime.now().plusDays(1), PageRequest.of(0, 100))
                : List.of();

        for (QuizSession s : userSessions) {
            if (s.getGradeResultJson() != null && s.getQuestionsJson() != null) {
                // simple counting from total & score
                String tag = s.getTag() != null ? s.getTag() : "종합";
                int[] stats = typeMap.computeIfAbsent(tag, k -> new int[2]);
                stats[0] += s.getTotalQuestions();
                stats[1] += Math.max(0, s.getTotalQuestions() - s.getScore());
            }
        }

        List<WeaknessAnalyticsDto.WeaknessTypeDto> weakTypes = new ArrayList<>();
        typeMap.forEach((tag, arr) -> {
            int tot = arr[0];
            int inc = arr[1];
            double rate = tot > 0 ? (double) inc / tot : 0.0;
            weakTypes.add(new WeaknessAnalyticsDto.WeaknessTypeDto(tag, tag, tot, inc, rate));
        });
        weakTypes.sort(Comparator.comparingDouble(WeaknessAnalyticsDto.WeaknessTypeDto::incorrectRate).reversed());

        List<String> reviewKeywords = topWeakConcepts.stream()
                .map(WeaknessAnalyticsDto.WeaknessConceptDto::word)
                .limit(10)
                .toList();

        return new WeaknessAnalyticsDto(
                totalAttempts,
                totalIncorrects,
                overallRate,
                topWeakConcepts,
                weakTypes,
                reviewKeywords
        );
    }
}
