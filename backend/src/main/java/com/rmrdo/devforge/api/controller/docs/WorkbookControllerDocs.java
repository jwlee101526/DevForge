package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.service.WorkbookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Tag(
    name = "Workbook API",
    description = """
        시스템 추천 문제집 조회 및 문제집 내 LLM 변형 문제 생성 API입니다.
        
        ### 주요 기능
        - **프리셋 문제집**: 기술 분야별 검증된 문제집 목록 제공
        - **LLM 변형 퀴즈**: 기존 문제집 문항을 AI가 지능적으로 변형하여 새롭게 출제
        """
)
public interface WorkbookControllerDocs {

    @Operation(summary = "Get Recommended Workbooks", description = "시스템에서 제공하는 프리셋 기술 문제집 목록을 조회합니다.")
    ResponseEntity<List<WorkbookService.WorkbookDto>> getWorkbooks();

    @Operation(summary = "Get Workbook Questions", description = "특정 문제집에 포함된 문제들을 조회합니다. (LLM 변형 옵션 선택 가능)")
    ResponseEntity<Map<String, Object>> getWorkbookQuestions(String id, boolean tweakWithLlm);
}
