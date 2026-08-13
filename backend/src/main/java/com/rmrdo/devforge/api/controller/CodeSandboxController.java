package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.api.controller.docs.CodeSandboxControllerDocs;
import com.rmrdo.devforge.application.service.CodeSandboxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sandbox")
@RequiredArgsConstructor
public class CodeSandboxController implements CodeSandboxControllerDocs {

    private final CodeSandboxService sandboxService;

    @PostMapping("/execute")
    public ResponseEntity<CodeSandboxService.SandboxResult> executeCode(
            @RequestBody Map<String, Object> payload) {
        String language = (String) payload.getOrDefault("language", "JAVA");
        String code = (String) payload.getOrDefault("code", "");

        List<CodeSandboxService.TestCase> testCases = List.of();
        if (payload.containsKey("testCases") && payload.get("testCases") instanceof List<?> rawList) {
            testCases = rawList.stream()
                    .filter(Map.class::isInstance)
                    .map(m -> (Map<?, ?>) m)
                    .map(m -> new CodeSandboxService.TestCase((String) m.get("input"), (String) m.get("expectedOutput")))
                    .toList();
        }

        CodeSandboxService.SandboxResult result = sandboxService.execute(language, code, testCases);
        return ResponseEntity.ok(result);
    }
}
