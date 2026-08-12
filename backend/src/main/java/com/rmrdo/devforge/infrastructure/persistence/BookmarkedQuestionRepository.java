package com.rmrdo.devforge.infrastructure.persistence;

import com.rmrdo.devforge.domain.entity.BookmarkedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookmarkedQuestionRepository extends JpaRepository<BookmarkedQuestion, UUID> {
    List<BookmarkedQuestion> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<BookmarkedQuestion> findByUserIdAndGroupIdOrderByCreatedAtDesc(UUID userId, UUID groupId);
    Optional<BookmarkedQuestion> findByUserIdAndQuestionId(UUID userId, String questionId);
}
