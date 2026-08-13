package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.request.SaveConceptRequest;
import com.rmrdo.devforge.application.dto.response.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.UUID;

@Tag(
    name = "Quiz & Learning API",
    description = """
        LLM 기반 맞춤형 퀴즈 생성, 자동 채점, 카테고리/개념 탐색, 약점 분석 및 학습 통계 API입니다.
        
        ### 주요 기능
        - **AI 퀴즈 생성 및 채점**: 카테고리/난이도별 LLM 퀴즈 출제 및 정답/AI 피드백 자동 생성
        - **학습 대시보드**: 개인 약점 분석, 기간별 통계 및 사용자 순위/랭킹 조회
        - **LLM 프로바이더**: Ollama, OpenAI, Claude 등 지원 모델 조회
        """
)
public interface QuizControllerDocs {

    @Operation(summary = "Get Categories", description = "학습 가능한 기술 카테고리 및 각 카테고리별 학습 진행 현황을 조회합니다.")
    ResponseEntity<CategoryListResponse> getCategories(String authHeader);

    @Operation(summary = "Get Concepts", description = "카테고리별 전체 학습 개념 단어 및 개별 진도율을 조회합니다.")
    ResponseEntity<ConceptListResponse> getConcepts(String authHeader);

    @Operation(summary = "Get Quiz Statistics", description = "지정한 기간(시작일~종료일) 동안의 학습 퀴즈 통계를 조회합니다.")
    ResponseEntity<QuizStatsResponse> getStats(String start, String end, String authHeader);

    @Operation(summary = "Get Weakness Analytics", description = "사용자의 오답 및 기권 데이터를 기반으로 정답률이 낮은 약점 기술 카테고리를 분석합니다.")
    ResponseEntity<WeaknessAnalyticsDto> getWeaknesses(String authHeader);

    @Operation(summary = "Generate AI Quiz", description = "선택한 카테고리 및 난이도 설정에 맞춰 LLM 기반 맞춤 퀴즈를 생성합니다.")
    ResponseEntity<QuizGenerateResponse> generateQuiz(QuizGenerateRequest request, String authHeader);

    @Operation(summary = "Grade Quiz Answers", description = "사용자가 제출한 퀴즈 답변을 정답 키와 비교하고 AI 피드백을 반영하여 자동 채점합니다.")
    ResponseEntity<QuizGradeResponse> gradeQuiz(QuizGradeRequest request);

    @Operation(summary = "Save Concept Word", description = "새로운 학습 개념 또는 커스텀 용어를 개인 학습 목록에 저장합니다.")
    ResponseEntity<Map<String, Object>> saveConcept(SaveConceptRequest request, String authHeader);

    @Operation(summary = "Get Quiz Session Detail", description = "특정 퀴즈 진행 세션 상세 정보를 조회합니다.")
    ResponseEntity<Map<String, Object>> getSession(UUID id, String authHeader);

    @Operation(summary = "Get AI Model Providers", description = "현재 시스템에 등록되어 사용 가능한 LLM 프로바이더(Ollama, OpenAI, Claude 등) 목록을 조회합니다.")
    ResponseEntity<Map<String, Object>> getProviders();

    @Operation(summary = "Get User Rank & Score", description = "전체 사용자 중 나의 정답률 및 학습 스코어 랭킹 순위를 조회합니다.")
    ResponseEntity<UserRankDto> getUserRank(String authHeader);
}
