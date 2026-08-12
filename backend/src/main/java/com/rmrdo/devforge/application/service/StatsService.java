package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.response.QuizStatsResponse;
import com.rmrdo.devforge.application.dto.response.QuizStatsResponse.ConceptStatDto;
import com.rmrdo.devforge.application.dto.response.QuizStatsResponse.SessionSummaryDto;
import com.rmrdo.devforge.application.dto.response.QuizStatsResponse.StatsSummaryDto;
import com.rmrdo.devforge.domain.entity.Concept;
import com.rmrdo.devforge.domain.entity.QuizSession;
import com.rmrdo.devforge.infrastructure.persistence.ConceptRepository;
import com.rmrdo.devforge.infrastructure.persistence.QuizSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
/** 퀴즈 세션과 개념 학습 이력을 조회해 사용자별 통계 화면용 결과를 구성한다. */
public class StatsService {

    private final QuizSessionRepository sessionRepository;
    private final ConceptRepository conceptRepository;

    @Transactional(readOnly = true)
    public QuizStatsResponse getStats(String start, String end) {
        return getStats(start, end, null);
    }

    @Transactional(readOnly = true)
    /** 조회 기간과 사용자를 고려하여 학습 통계 결과를 구성한다. */
    public QuizStatsResponse getStats(String start, String end, UUID userId) {
        LocalDateTime from;
        try {
            from = (start != null && !start.isBlank()) ? LocalDate.parse(start).atStartOfDay() : LocalDateTime.now().minusDays(7);
        } catch (Exception e) {
            from = LocalDateTime.now().minusDays(7);
        }

        LocalDateTime to;
        try {
            to = (end != null && !end.isBlank()) ? LocalDate.parse(end).plusDays(1).atStartOfDay() : LocalDateTime.now().plusDays(1);
        } catch (Exception e) {
            to = LocalDateTime.now().plusDays(1);
        }

        List<QuizSession> sessions;
        List<Concept> concepts;

        if (userId != null) {
            sessions = sessionRepository.findByUserIdAndScopeAndCreatedAtBetweenOrderByCreatedAtDesc(userId, "PERSONAL", from, to, PageRequest.of(0, 50));
            if (sessions.isEmpty()) {
                sessions = sessionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(from, to, PageRequest.of(0, 50));
            }
            concepts = conceptRepository.findByUserIdAndScopeOrderByCreatedAtDesc(userId, "PERSONAL");
            if (concepts.isEmpty()) {
                concepts = conceptRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            sessions = sessionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(from, to, PageRequest.of(0, 50));
            concepts = conceptRepository.findAllByOrderByCreatedAtDesc();
        }

        List<ConceptStatDto> wordStats = concepts.stream()
                .filter(c -> c.getAttemptCount() > 0)
                .sorted(Comparator.comparingInt(Concept::getIncorrectCount).reversed())
                .limit(20)
                .map(c -> new ConceptStatDto(
                        c.getWord(),
                        c.getAttemptCount(),
                        c.getIncorrectCount(),
                        c.getIncorrectRate(),
                        c.getAccuracy()
                )).toList();

        List<SessionSummaryDto> recentSessions = sessions.stream()
                .map(s -> new SessionSummaryDto(
                        s.getId().toString(),
                        s.getTotalQuestions(),
                        s.getScore(),
                        s.getTag(),
                        s.getCompletedAt() != null ? s.getCompletedAt().format(DateTimeFormatter.ISO_DATE_TIME) : null
                )).toList();

        StatsSummaryDto summary = new StatsSummaryDto(sessions.size());

        return new QuizStatsResponse(summary, wordStats, recentSessions);
    }
}
