package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.domain.entity.Concept;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(name = "자작 문제 API", description = "사용자가 직접 작성하는 자작 문제 및 개인 커스텀 개념 출제")
public interface CustomQuestionControllerDocs {

    @Operation(summary = "자작 문제 등록", description = "사용자가 직접 문제(개념 단어, 뜻, 예문, 태그)를 작성하여 개인 문제집에 등록합니다.")
    ResponseEntity<Concept> createCustomQuestion(Map<String, String> payload, String authHeader);
}
