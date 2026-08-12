package com.rmrdo.devforge.infrastructure.persistence;

import com.rmrdo.devforge.domain.entity.QuizSession;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface QuizSessionRepository extends JpaRepository<QuizSession, UUID> {

    List<QuizSession> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from, LocalDateTime to, Pageable pageable);

    default List<QuizSession> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime from, LocalDateTime to) {
        return findByCreatedAtBetweenOrderByCreatedAtDesc(from, to, PageRequest.of(0, 50));
    }

    List<QuizSession> findByScopeAndCreatedAtBetweenOrderByCreatedAtDesc(String scope, LocalDateTime from, LocalDateTime to, Pageable pageable);

    default List<QuizSession> findByScopeAndCreatedAtBetweenOrderByCreatedAtDesc(String scope, LocalDateTime from, LocalDateTime to) {
        return findByScopeAndCreatedAtBetweenOrderByCreatedAtDesc(scope, from, to, PageRequest.of(0, 50));
    }

    List<QuizSession> findByUserIdAndScopeAndCreatedAtBetweenOrderByCreatedAtDesc(UUID userId, String scope, LocalDateTime from, LocalDateTime to, Pageable pageable);

    default List<QuizSession> findByUserIdAndScopeAndCreatedAtBetweenOrderByCreatedAtDesc(UUID userId, String scope, LocalDateTime from, LocalDateTime to) {
        return findByUserIdAndScopeAndCreatedAtBetweenOrderByCreatedAtDesc(userId, scope, from, to, PageRequest.of(0, 50));
    }
}
