package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.service.WorkbookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Tag(name = "문제집(Workbook) API", description = "추천 문제집 목록 조회 및 문제집 내 LLM 변형 문제 출제")
public interface WorkbookControllerDocs {

    @Operation(summary = "추천 문제집 목록 조회", description = "시스템에서 제공하는 프리셋 기술 문제집 목록을 조회합니다.")
    ResponseEntity<List<WorkbookService.WorkbookDto>> getWorkbooks();

    @Operation(summary = "문제집 수록 문제 조회", description = "특정 문제집에 포함된 문제들을 조회합니다. (LLM 변형 옵션 선택 가능)")
    ResponseEntity<Map<String, Object>> getWorkbookQuestions(String id, boolean tweakWithLlm);
}
