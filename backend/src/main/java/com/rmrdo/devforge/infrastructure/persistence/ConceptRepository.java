package com.rmrdo.devforge.infrastructure.persistence;

import com.rmrdo.devforge.domain.entity.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConceptRepository extends JpaRepository<Concept, UUID> {

    List<Concept> findAllByOrderByCreatedAtDesc();

    List<Concept> findByScopeOrderByCreatedAtDesc(String scope);

    List<Concept> findByUserIdAndScopeOrderByCreatedAtDesc(UUID userId, String scope);

    @Query("SELECT DISTINCT c.tag FROM Concept c WHERE c.tag IS NOT NULL AND c.tag <> '' ORDER BY c.tag ASC")
    List<String> findDistinctTags();

    @Query("SELECT DISTINCT c.tag FROM Concept c WHERE c.tag IS NOT NULL AND c.tag <> '' AND c.scope = :scope ORDER BY c.tag ASC")
    List<String> findDistinctTagsByScope(@Param("scope") String scope);

    @Query("SELECT DISTINCT c.tag FROM Concept c WHERE c.tag IS NOT NULL AND c.tag <> '' AND c.userId = :userId AND c.scope = :scope ORDER BY c.tag ASC")
    List<String> findDistinctTagsByUserIdAndScope(@Param("userId") UUID userId, @Param("scope") String scope);

    Optional<Concept> findByWord(String word);

    Optional<Concept> findByWordAndScope(String word, String scope);

    Optional<Concept> findByWordAndUserIdAndScope(String word, UUID userId, String scope);
}
