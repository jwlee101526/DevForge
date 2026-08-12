package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.service.CustomQuestionService;
import com.rmrdo.devforge.domain.entity.Concept;
import com.rmrdo.devforge.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions/custom")
@RequiredArgsConstructor
/** 사용자가 직접 작성하는 자작 문제 출제 REST API를 제공한다. */
public class CustomQuestionController {

    private final CustomQuestionService customQuestionService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping
    public ResponseEntity<Concept> createCustomQuestion(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = extractUserId(authHeader);
        String word = payload.get("word");
        String korean = payload.get("korean");
        String example = payload.get("example");
        String tag = payload.get("tag");

        Concept created = customQuestionService.createCustomQuestion(userId, word, korean, example, tag);
        return ResponseEntity.ok(created);
    }

    private UUID extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return UUID.fromString("00000000-0000-0000-0000-000000000000");
        }
        String token = authHeader.substring(7);
        UUID userId = tokenProvider.getUserIdFromToken(token);
        return userId != null ? userId : UUID.fromString("00000000-0000-0000-0000-000000000000");
    }
}
