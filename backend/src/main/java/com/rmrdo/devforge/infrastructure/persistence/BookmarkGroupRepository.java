package com.rmrdo.devforge.infrastructure.persistence;

import com.rmrdo.devforge.domain.entity.BookmarkGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookmarkGroupRepository extends JpaRepository<BookmarkGroup, UUID> {
    List<BookmarkGroup> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
