package com.rmrdo.devforge.infrastructure.persistence;

import com.rmrdo.devforge.domain.entity.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConceptRepository extends JpaRepository<Concept, UUID> {

    List<Concept> findAllByOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT c.tag FROM Concept c WHERE c.tag IS NOT NULL AND c.tag <> '' ORDER BY c.tag ASC")
    List<String> findDistinctTags();

    Optional<Concept> findByWord(String word);
}
