package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.domain.entity.Concept;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(
    name = "Custom Question API",
    description = """
        사용자가 직접 출제하는 자작 문제 및 개인 커스텀 학습 용어 등록 API입니다.
        
        ### 주요 기능
        - **개인 문제 출제**: 개념 단어, 설명/뜻, 예문 및 태그를 지정하여 나만의 문제집 구축
        - **보안 요구사항**: `Authorization: Bearer <JWT_TOKEN>` 헤더 필수
        """
)
public interface CustomQuestionControllerDocs {

    @Operation(summary = "Create Custom Question", description = "사용자가 직접 문제(개념 단어, 뜻, 예문, 태그)를 작성하여 개인 문제집에 등록합니다.")
    ResponseEntity<Concept> createCustomQuestion(Map<String, String> payload, String authHeader);
}
