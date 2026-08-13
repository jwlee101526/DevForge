package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.response.UserRankDto;
import com.rmrdo.devforge.domain.entity.QuizSession;
import com.rmrdo.devforge.infrastructure.persistence.QuizSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 사용자 등급(Tier/Rank) 및 경력 XP 계산을 담당하는 독립 서비스 클래스.
 */
@Service
@RequiredArgsConstructor
public class UserGradeService {

    private final QuizSessionRepository sessionRepository;

    /**
     * 지정된 사용자의 누적 퀴즈 정답 수 및 점수를 기반으로 독립된 사용자 등급(F~S 랭크) 정보를 산출한다.
     *
     * @param userId 사용자 식별 ID
     * @return 계산된 사용자 등급 정보 (UserRankDto)
     */
    @Transactional(readOnly = true)
    public UserRankDto getUserGrade(UUID userId) {
        if (userId == null) {
            return UserRankDto.calculate(0);
        }

        List<QuizSession> sessions = sessionRepository.findByUserIdAndScopeAndCreatedAtBetweenOrderByCreatedAtDesc(
                userId,
                "PERSONAL",
                LocalDateTime.now().minusYears(10),
                LocalDateTime.now().plusDays(1),
                PageRequest.of(0, 1000)
        );

        int totalXp = 0;
        for (QuizSession session : sessions) {
            totalXp += session.getScore() * 15;
        }

        return UserRankDto.calculate(totalXp);
    }
}
