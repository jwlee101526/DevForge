package com.rmrdo.devforge.api.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(name = "시나리오 면접 API", description = "실시간 모의 개발 면접 및 꼬리 질문 심화 진행")
public interface ScenarioControllerDocs {

    @Operation(summary = "시나리오 면접 시작", description = "선택한 기술 스택을 바탕으로 AI 모의 면접 세션을 생성하고 첫 번째 면접 질문을 출력합니다.")
    ResponseEntity<Map<String, Object>> startScenario(Map<String, String> payload);

    @Operation(summary = "면접 꼬리 질문 진행", description = "사용자의 답변에 대한 평가 및 심화 꼬리 질문(Follow-up)을 연속으로 진행합니다.")
    ResponseEntity<Map<String, Object>> continueScenarioFollowup(Map<String, String> payload);
}
