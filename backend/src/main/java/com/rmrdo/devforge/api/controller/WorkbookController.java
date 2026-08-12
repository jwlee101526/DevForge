package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.service.WorkbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workbooks")
@RequiredArgsConstructor
/** 정해진 문제집(문제 세트) 및 LLM 변형 문제 출제 REST API를 제공한다. */
public class WorkbookController {

    private final WorkbookService workbookService;

    @GetMapping
    public ResponseEntity<List<WorkbookService.WorkbookDto>> getWorkbooks() {
        return ResponseEntity.ok(workbookService.getWorkbooks());
    }

    @GetMapping("/{id}/questions")
    public ResponseEntity<Map<String, Object>> getWorkbookQuestions(
            @PathVariable String id,
            @RequestParam(defaultValue = "false") boolean tweakWithLlm) {
        return ResponseEntity.ok(workbookService.getWorkbookQuestions(id, tweakWithLlm));
    }
}
