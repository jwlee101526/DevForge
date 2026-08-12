package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.response.ChoiceDto;
import com.rmrdo.devforge.application.dto.response.QuestionDto;
import com.rmrdo.devforge.application.port.AiProviderFactory;
import com.rmrdo.devforge.application.port.AiQuizGenerator;
import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
/** 정해진 엄선 문제집 제공 및 LLM 문제 꼬기/변형 기능을 처리하는 애플리케이션 서비스 */
public class WorkbookService {

    private final AiProviderFactory providerFactory;

    public record WorkbookDto(
            String id,
            String title,
            String description,
            String category,
            int questionCount,
            String difficulty
    ) {}

    private static final List<WorkbookDto> CURATED_WORKBOOKS = List.of(
            new WorkbookDto("wb-java-core", "Java 핵심 백엔드 문제집", "JVM 메모리, 멀티스레딩, 자바 21+ 최신 문법 필수 문제집", "Java", 5, "medium"),
            new WorkbookDto("wb-spring-arch", "Spring Boot & JPA 아키텍처", "영속성 컨텍스트, 트랜잭션 전파, 빈 생명주기 실무 문제집", "Spring", 5, "hard"),
            new WorkbookDto("wb-db-sql", "데이터베이스 & SQL 성능 튜닝", "인덱스 최적화, 트랜잭션 격리수준, 클러스터링 인덱스", "DB", 5, "hard"),
            new WorkbookDto("wb-os-net", "OS & CS 펀더멘털 실무 세트", "프로세스/스레드, 동기화, HTTP 2/3, TCP/IP 핸드셰이크", "CS/OS", 5, "medium")
    );

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<WorkbookDto> getWorkbooks() {
        return CURATED_WORKBOOKS;
    }

    public Map<String, Object> getWorkbookQuestions(String workbookId, boolean tweakWithLlm) {
        List<QuestionDto> baseQuestions = getCuratedBaseQuestions(workbookId);

        if (!tweakWithLlm) {
            Map<String, Object> res = new HashMap<>();
            res.put("workbookId", workbookId);
            res.put("tweakWithLlm", false);
            res.put("questions", baseQuestions);
            return res;
        }

        // LLM 꼬기/변형 모드: AI에게 기본 문제 정보를 전달해 오답 선택지를 교묘하게 꼬거나 상황을 변형하도록 요청
        try {
            AiQuizGenerator provider = providerFactory.getAvailableProvider();
            String promptInstruction = "기존 정해진 퀴즈의 의미를 유지하되, 정답과 오답 선택지를 실무 개발상황에 맞춰 살짝 꼬아서(변형) 변형 문제 세트를 생성해 주세요.";
            QuizGenerateRequest req = new QuizGenerateRequest(
                    "custom",
                    workbookId,
                    false,
                    List.of(workbookId),
                    false,
                    false,
                    "",
                    "",
                    promptInstruction,
                    baseQuestions.size(),
                    Map.of("meaning_choice", 2, "context_choice", 2, "sentence_answer", 1),
                    List.of(workbookId.replace("wb-", "")),
                    "hard"
            );
            QuizGenerateResponse aiRes = provider.generateQuiz(req);
            Map<String, Object> res = new HashMap<>();
            res.put("workbookId", workbookId);
            res.put("tweakWithLlm", true);
            res.put("questions", aiRes.questions() != null ? aiRes.questions() : baseQuestions);
            return res;
        } catch (Exception e) {
            log.error("Failed to generate tweaked workbook questions, falling back to base questions", e);
            Map<String, Object> res = new HashMap<>();
            res.put("workbookId", workbookId);
            res.put("tweakWithLlm", false);
            res.put("questions", baseQuestions);
            return res;
        }
    }

    private List<QuestionDto> getCuratedBaseQuestions(String workbookId) {
        if ("wb-java-core".equalsIgnoreCase(workbookId)) {
            return List.of(
                    new QuestionDto(
                            "wb-q1", "meaning_choice", "medium",
                            "JVM Heap 메모리의 Young Generation과 Old Generation 간의 Major GC와 Minor GC의 주요 차이점은 무엇인가?",
                            null, "JVM GC", "choice",
                            List.of(
                                    new ChoiceDto("A", "Minor GC는 Eden/Survivor 영역만 대상으로 빠르게 수행되며, Major GC는 Old 영역을 대상으로 실행된다."),
                                    new ChoiceDto("B", "Minor GC 시에는 Stop-The-World가 전혀 발생하지 않는다."),
                                    new ChoiceDto("C", "Major GC는 객체의 참조 카운트가 0이 될 때만 즉시 호출된다."),
                                    new ChoiceDto("D", "Young Generation 영역이 가득 차면 Major GC가 발생한다.")
                            )
                    ),
                    new QuestionDto(
                            "wb-q2", "context_choice", "hard",
                            "자바 21 Virtual Thread 사용 시 synchronized 블록 내부에서 I/O 작업을 수행할 때 발생하는 현상은?",
                            "```java\nsynchronized(lock) {\n    fileInputStream.read(); // I/O 수행\n}\n```",
                            "Virtual Thread Pinning", "choice",
                            List.of(
                                    new ChoiceDto("A", "Virtual Thread가 Carrier Thread에 고정(Pinning)되어 다른 가상 스레드의 스케줄링을 방하할 수 있다."),
                                    new ChoiceDto("B", "가상 스레드가 즉시 종료되며 InterruptedException이 던져진다."),
                                    new ChoiceDto("C", "ReentrantLock과 동일하게 자동으로 Unpark 처리된다."),
                                    new ChoiceDto("D", "Heap 메모리가 즉시 전량 해제된다.")
                            )
                    )
            );
        }

        // Default Spring & DB Workbook
        return List.of(
                new QuestionDto(
                        "wb-sp1", "meaning_choice", "hard",
                        "Spring JPA의 @Transactional(propagation = Propagation.REQUIRES_NEW) 동작 방식에 대한 설명으로 옳은 것은?",
                        null, "Propagation.REQUIRES_NEW", "choice",
                        List.of(
                                new ChoiceDto("A", "기존 트랜잭션을 일시 중지(Suspend)하고 새로운 독립된 트랜잭션을 시작한다."),
                                new ChoiceDto("B", "기존 트랜잭션에 참여하여 중첩 예외만 처리한다."),
                                new ChoiceDto("C", "트랜잭션 없이 항상 비동기로 실행된다."),
                                new ChoiceDto("D", "부모 트랜잭션이 롤백되어도 신규 트랜잭션은 부모와 함께 강제 롤백된다.")
                        )
                )
        );
    }
}
