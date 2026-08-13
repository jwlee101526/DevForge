package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.api.controller.docs.WorkbookControllerDocs;
import com.rmrdo.devforge.application.service.WorkbookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/workbooks")
@RequiredArgsConstructor
public class WorkbookController implements WorkbookControllerDocs {

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
