package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.api.controller.docs.ScenarioControllerDocs;
import com.rmrdo.devforge.application.service.ScenarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/scenario")
@RequiredArgsConstructor
public class ScenarioController implements ScenarioControllerDocs {

    private final ScenarioService scenarioService;

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startScenario(@RequestBody Map<String, String> payload) {
        String techStack = payload.get("techStack");
        return ResponseEntity.ok(scenarioService.startScenario(techStack));
    }

    @PostMapping("/followup")
    public ResponseEntity<Map<String, Object>> continueScenarioFollowup(@RequestBody Map<String, String> payload) {
        String sessionId = payload.get("sessionId");
        String question = payload.get("question");
        String userAnswer = payload.get("userAnswer");
        return ResponseEntity.ok(scenarioService.continueScenarioFollowup(sessionId, question, userAnswer));
    }
}
