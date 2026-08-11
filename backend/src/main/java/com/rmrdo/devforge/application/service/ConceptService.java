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

@Service
@RequiredArgsConstructor
/** 개념 카테고리·목록 조회와 단어장 저장을 담당한다. */
public class ConceptService {

    private final ConceptRepository conceptRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Transactional(readOnly = true)
    /** 저장된 개념에서 중복 없는 카테고리를 조회한다. */
    public CategoryListResponse getCategories() {
        List<String> tags = conceptRepository.findDistinctTags();
        return new CategoryListResponse(tags);
    }

    @Transactional(readOnly = true)
    /** 개념 목록을 화면용 DTO와 학습 통계로 변환한다. */
    public ConceptListResponse getConcepts() {
        List<Concept> concepts = conceptRepository.findAllByOrderByCreatedAtDesc();
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
    /** 같은 단어의 중복 저장을 막고 새로운 개념을 단어장에 등록한다. */
    public Map<String, Object> saveConcept(SaveConceptRequest request) {
        Map<String, Object> result = new HashMap<>();
        if (request.suggestedWord() == null || request.suggestedWord().isBlank()) {
            result.put("success", false);
            result.put("error", "word is required");
            return result;
        }

        Optional<Concept> existing = conceptRepository.findByWord(request.suggestedWord());
        if (existing.isPresent()) {
            result.put("success", true);
            result.put("message", "already exists");
            return result;
        }

        Concept concept = new Concept();
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
