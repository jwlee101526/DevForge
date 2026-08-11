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
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
/** 퀴즈 생성·채점과 개념·통계 조회 API를 제공한다. */
public class QuizController {

    private final QuizService quizService;
    private final ConceptService conceptService;
    private final StatsService statsService;
    private final AiProviderFactory providerFactory;

    @GetMapping("/categories")
    /** 저장된 개념의 카테고리 목록을 반환한다. */
    public ResponseEntity<CategoryListResponse> getCategories() {
        return ResponseEntity.ok(conceptService.getCategories());
    }

    @GetMapping("/concepts")
    /** 저장된 개념 목록과 학습 통계를 반환한다. */
    public ResponseEntity<ConceptListResponse> getConcepts() {
        return ResponseEntity.ok(conceptService.getConcepts());
    }

    @GetMapping("/stats")
    /** 기간별 퀴즈 세션 및 개념 학습 통계를 반환한다. */
    public ResponseEntity<QuizStatsResponse> getStats(
            @RequestParam(required = false) String start,
            @RequestParam(required = false) String end) {
        return ResponseEntity.ok(statsService.getStats(start, end));
    }

    @PostMapping("/generate")
    /** AI를 통해 퀴즈를 생성하고 채점용 세션 토큰을 발급한다. */
    public ResponseEntity<QuizGenerateResponse> generateQuiz(@RequestBody QuizGenerateRequest request) {
        return ResponseEntity.ok(quizService.generateQuiz(request));
    }

    @PostMapping("/grade")
    /** 제출된 답안을 세션의 정답 정보로 채점한다. */
    public ResponseEntity<QuizGradeResponse> gradeQuiz(@RequestBody QuizGradeRequest request) {
        return ResponseEntity.ok(quizService.gradeQuiz(request));
    }

    @PostMapping("/concepts/save")
    /** 오답에서 제안된 개념을 단어장에 저장한다. */
    public ResponseEntity<Map<String, Object>> saveConcept(@RequestBody SaveConceptRequest request) {
        Map<String, Object> result = conceptService.saveConcept(request);
        if (Boolean.FALSE.equals(result.get("success"))) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sessions/{id}")
    /** 저장된 퀴즈 세션의 문제·답안·채점 결과를 조회한다. */
    public ResponseEntity<Map<String, Object>> getSession(@PathVariable UUID id) {
        Map<String, Object> sessionData = quizService.getSession(id);
        if (sessionData == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sessionData);
    }

    @GetMapping("/providers")
    /** 현재 등록된 AI 제공자 목록을 반환한다. */
    public ResponseEntity<Map<String, Object>> getProviders() {
        return ResponseEntity.ok(Map.of("providers", providerFactory.getRegisteredProviderNames()));
    }
}
