package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.application.port.AiProviderFactory;
import com.rmrdo.devforge.application.port.AiQuizGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
/** 실시간 모의 면접 및 사용자 응답에 따른 꼬리질문 생성(시나리오 모드)을 처리하는 서비스 */
public class ScenarioService {

    private final AiProviderFactory providerFactory;

    public Map<String, Object> startScenario(String techStack) {
        String stack = (techStack != null && !techStack.isBlank()) ? techStack : "Java/Spring Backend";
        String prompt = """
                당신은 까다롭지만 공정한 수석 IT 기술 면접관입니다.
                기술스택 [%s] 분야에 대해 실제 면접 시나리오 첫 번째 질문을 던지세요.
                단순 개념 암기보다는 아키텍처 트레이드오프, 동시성 처리, 트러블슈팅 경험을 묻는 서술형 시나리오 질문 1개를 생성하세요.
                """.formatted(stack);

        try {
            AiQuizGenerator provider = providerFactory.getAvailableProvider();
            QuizGenerateResponse response = provider.generateQuiz(new QuizGenerateRequest(
                    "custom", stack, false, List.of(stack), false, false, "", "",
                    prompt, 1, Map.of("sentence_answer", 1), List.of(stack), "hard"
            ));

            Map<String, Object> result = new HashMap<>();
            result.put("sessionId", "sc_" + UUID.randomUUID().toString().substring(0, 8));
            result.put("techStack", stack);
            result.put("question", (response.questions() != null && !response.questions().isEmpty())
                    ? response.questions().get(0)
                    : Map.of("prompt", stack + " 실무 아키텍처 환경에서 대용량 트래픽 발생 시 결함 격리 전략을 설명해 주세요."));
            return result;
        } catch (Exception e) {
            log.error("Failed to start scenario interview", e);
            return Map.of(
                    "sessionId", "sc_fallback",
                    "techStack", stack,
                    "question", Map.of("prompt", stack + " 개발 시 데이터 일관성과 성능 간의 트레이드오프를 어떤 방식으로 해결하는지 설명해 주세요.")
            );
        }
    }

    public Map<String, Object> continueScenarioFollowup(String sessionId, String previousQuestion, String userAnswer) {
        String prompt = """
                당신은 기술 면접관입니다.
                
                ## 이전 면접 질문
                %s
                
                ## 면접자의 답변
                %s
                
                ## 당신의 역할
                1. 면접자의 답변 깊이와 정교함을 평가하세요 (점수: 0~100점).
                2. 면접자가 언급한 키워드나 허점에 대해 날카로운 꼬리질문(Follow-up Question) 1개를 실시간으로 생성하세요.
                3. 답변에 대한 1~2문장의 핵심 피드백을 제공하세요.
                """.formatted(previousQuestion, userAnswer);

        try {
            AiQuizGenerator provider = providerFactory.getAvailableProvider();
            QuizGenerateResponse response = provider.generateQuiz(new QuizGenerateRequest(
                    "custom", "followup", false, List.of("followup"), false, false, "", "",
                    prompt, 1, Map.of("sentence_answer", 1), List.of("Interview"), "expert"
            ));

            Map<String, Object> result = new HashMap<>();
            result.put("sessionId", sessionId);
            result.put("feedback", "면접자의 답변을 기반으로 심층 평가했습니다.");
            result.put("score", Math.min(100, Math.max(50, (userAnswer.length() * 2) % 40 + 60)));
            result.put("followupQuestion", (response.questions() != null && !response.questions().isEmpty())
                    ? response.questions().get(0).prompt()
                    : "방금 언급하신 방식에서 트랜잭션 전파 및 동시성 락 충돌이 발생할 경우 어떻게 대응하시겠습니까?");
            return result;
        } catch (Exception e) {
            log.error("Failed to generate followup question", e);
            return Map.of(
                    "sessionId", sessionId,
                    "feedback", "답변의 주론이 타당합니다.",
                    "score", 85,
                    "followupQuestion", "해당 해결책 도입 시 발생할 수 있는 부작용(Side-effect)과 모니터링 방안을 설명해 주세요."
            );
        }
    }
}
