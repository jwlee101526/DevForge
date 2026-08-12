package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.request.SaveConceptRequest;
import com.rmrdo.devforge.application.dto.response.CategoryListResponse;
import com.rmrdo.devforge.application.dto.response.ConceptListResponse;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;
import com.rmrdo.devforge.application.dto.response.QuizStatsResponse;
import com.rmrdo.devforge.application.port.AiProviderFactory;
import com.rmrdo.devforge.application.service.ConceptService;
import com.rmrdo.devforge.application.service.QuizService;
import com.rmrdo.devforge.application.service.StatsService;
import com.rmrdo.devforge.application.service.WeaknessService;
import com.rmrdo.devforge.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
/** 퀴즈 생성·채점과 개념·통계 조회 API를 제공하며, 사용자 인증 헤더를 처리한다. */
public class QuizController {

    private final QuizService quizService;
    private final ConceptService conceptService;
    private final StatsService statsService;
    private final WeaknessService weaknessService;
    private final AiProviderFactory providerFactory;
    private final SecurityUtils securityUtils;

    @GetMapping("/categories")
    public ResponseEntity<CategoryListResponse> getCategories(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(conceptService.getCategories(userId));
    }

    @GetMapping("/concepts")
    public ResponseEntity<ConceptListResponse> getConcepts(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(conceptService.getConcepts(userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<QuizStatsResponse> getStats(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(statsService.getStats(start, end, userId));
    }

    @GetMapping("/weaknesses")
    public ResponseEntity<com.rmrdo.devforge.application.dto.response.WeaknessAnalyticsDto> getWeaknesses(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(weaknessService.getWeaknessAnalytics(userId));
    }

    @PostMapping("/generate")
    public ResponseEntity<QuizGenerateResponse> generateQuiz(
            @RequestBody QuizGenerateRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(quizService.generateQuiz(request, userId));
    }

    @PostMapping("/grade")
    public ResponseEntity<QuizGradeResponse> gradeQuiz(@RequestBody QuizGradeRequest request) {
        return ResponseEntity.ok(quizService.gradeQuiz(request));
    }

    @PostMapping("/concepts/save")
    public ResponseEntity<Map<String, Object>> saveConcept(
            @RequestBody SaveConceptRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        Map<String, Object> result = conceptService.saveConcept(request, userId);
        if (Boolean.FALSE.equals(result.get("success"))) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<Map<String, Object>> getSession(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        Map<String, Object> sessionData = quizService.getSession(id, userId);
        if (sessionData == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sessionData);
    }

    @GetMapping("/providers")
    public ResponseEntity<Map<String, Object>> getProviders() {
        return ResponseEntity.ok(Map.of(
                "providers", providerFactory.getRegisteredProviderNames(),
                "statuses", providerFactory.getProviderStatuses()
        ));
    }

    @GetMapping("/stats/rank")
    public ResponseEntity<com.rmrdo.devforge.application.dto.response.UserRankDto> getUserRank(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(statsService.getUserRank(userId));
    }
}
