package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.request.SaveConceptRequest;
import com.rmrdo.devforge.application.dto.response.CategoryListResponse;
import com.rmrdo.devforge.application.dto.response.ConceptItemDto;
import com.rmrdo.devforge.application.dto.response.ConceptListResponse;
import com.rmrdo.devforge.domain.entity.Concept;
import com.rmrdo.devforge.infrastructure.persistence.ConceptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
/** 개념 카테고리·목록 조회와 단어장 저장을 담당하며, 계정별 개인 학습 이력을 분리 관리한다. */
public class ConceptService {

    private final ConceptRepository conceptRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Transactional(readOnly = true)
    public CategoryListResponse getCategories() {
        return getCategories(null);
    }

    @Transactional(readOnly = true)
    public CategoryListResponse getCategories(UUID userId) {
        List<String> tags;
        if (userId != null) {
            tags = conceptRepository.findDistinctTagsByUserIdAndScope(userId, "PERSONAL");
            if (tags.isEmpty()) {
                tags = conceptRepository.findDistinctTags();
            }
        } else {
            tags = conceptRepository.findDistinctTags();
        }
        return new CategoryListResponse(tags);
    }

    @Transactional(readOnly = true)
    public ConceptListResponse getConcepts() {
        return getConcepts(null);
    }

    @Transactional(readOnly = true)
    public ConceptListResponse getConcepts(UUID userId) {
        List<Concept> concepts;
        if (userId != null) {
            concepts = conceptRepository.findByUserIdAndScopeOrderByCreatedAtDesc(userId, "PERSONAL");
            if (concepts.isEmpty()) {
                concepts = conceptRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            concepts = conceptRepository.findAllByOrderByCreatedAtDesc();
        }

        List<ConceptItemDto> items = concepts.stream().map(c -> new ConceptItemDto(
                c.getId().toString(),
                c.getWord(),
                c.getTag(),
                c.getCreatedAt() != null ? c.getCreatedAt().format(DATE_FORMATTER) : null,
                c.getNextReview() != null ? c.getNextReview().format(DATE_FORMATTER) : null,
                c.getAttemptCount(),
                c.getIncorrectCount(),
                c.getAccuracy(),
                c.getIncorrectRate()
        )).toList();

        return new ConceptListResponse(items);
    }

    @Transactional
    public Map<String, Object> saveConcept(SaveConceptRequest request) {
        return saveConcept(request, null);
    }

    @Transactional
    public Map<String, Object> saveConcept(SaveConceptRequest request, UUID userId) {
        Map<String, Object> result = new HashMap<>();
        if (request.suggestedWord() == null || request.suggestedWord().isBlank()) {
            result.put("success", false);
            result.put("error", "word is required");
            return result;
        }

        Optional<Concept> existing;
        if (userId != null) {
            existing = conceptRepository.findByWordAndUserIdAndScope(request.suggestedWord(), userId, "PERSONAL");
        } else {
            existing = conceptRepository.findByWord(request.suggestedWord());
        }

        if (existing.isPresent()) {
            result.put("success", true);
            result.put("message", "already exists");
            return result;
        }

        Concept concept = new Concept();
        concept.setUserId(userId);
        concept.setScope("PERSONAL");
        concept.setWord(request.suggestedWord());
        concept.setKorean(request.suggestedKorean());
        concept.setEnglishDef(request.suggestedEnglishDef());
        concept.setExample(request.suggestedExample());
        concept.setTag(request.suggestedTag() != null ? request.suggestedTag() : "");

        conceptRepository.save(concept);

        result.put("success", true);
        return result;
    }
}
