package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.domain.entity.Concept;
import com.rmrdo.devforge.infrastructure.persistence.ConceptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
/** 사용자가 직접 개발 문제 및 개념을 직접 등록/작성할 수 있는 서비스 */
public class CustomQuestionService {

    private final ConceptRepository conceptRepository;

    @Transactional
    /** 신규 사용자 직접 작성 문제/개념을 데이터베이스에 저장한다. */
    public Concept createCustomQuestion(
            UUID userId,
            String word,
            String koreanMeaning,
            String codeExample,
            String tag
    ) {
        if (word == null || word.isBlank()) {
            throw new IllegalArgumentException("개념 키워드는 필수입니다.");
        }

        Concept concept = Concept.builder()
                .userId(userId)
                .scope(userId != null ? "PERSONAL" : "GLOBAL")
                .word(word.trim())
                .korean(koreanMeaning != null ? koreanMeaning.trim() : "")
                .example(codeExample != null ? codeExample.trim() : "")
                .tag(tag != null && !tag.isBlank() ? tag.trim() : "사용자 작성")
                .attemptCount(0)
                .incorrectCount(0)
                .build();

        return conceptRepository.save(concept);
    }
}
