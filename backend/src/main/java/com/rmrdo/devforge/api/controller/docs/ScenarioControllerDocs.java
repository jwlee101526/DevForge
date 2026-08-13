package com.rmrdo.devforge.api.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(
    name = "Scenario Interview API",
    description = """
        실시간 모의 기술 면접 및 꼬리 질문(Follow-up) 심화 세션 진행 API입니다.
        
        ### 진행 방식
        1. **면접 시작**: 기술 스택 지정 후 1차 면접 질문 생성
        2. **꼬리 질문**: 사용자 답변을 AI가 평가한 후 심화 연계 질문 연속 진행
        """
)
public interface ScenarioControllerDocs {

    @Operation(summary = "Start Scenario Interview", description = "선택한 기술 스택을 바탕으로 AI 모의 면접 세션을 생성하고 첫 번째 면접 질문을 출력합니다.")
    ResponseEntity<Map<String, Object>> startScenario(Map<String, String> payload);

    @Operation(summary = "Continue Interview Follow-up Question", description = "사용자의 답변에 대한 평가 및 심화 꼬리 질문(Follow-up)을 연속으로 진행합니다.")
    ResponseEntity<Map<String, Object>> continueScenarioFollowup(Map<String, String> payload);
}
