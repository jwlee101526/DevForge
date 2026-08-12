package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;
import com.rmrdo.devforge.application.port.AiProviderFactory;
import com.rmrdo.devforge.domain.entity.QuizSession;
import com.rmrdo.devforge.infrastructure.persistence.QuizSessionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class QuizServiceTest {

    @Test
    void gradeQuizUsesStoredAnswerKeyWithoutCallingAiProvider() {
        AiProviderFactory providerFactory = mock(AiProviderFactory.class);
        QuizSessionRepository sessionRepository = mock(QuizSessionRepository.class);
        ObjectMapper objectMapper = new ObjectMapper();
        WeaknessService weaknessService = mock(WeaknessService.class);
        QuizService service = new QuizService(providerFactory, sessionRepository, objectMapper, weaknessService);

        QuizSession session = new QuizSession();
        session.setId(UUID.randomUUID());
        session.setAnswerToken("st_test");
        session.setCreatedAt(LocalDateTime.now());
        session.setQuestionsJson("""
                [
                  {
                    "id": "q1",
                    "questionType": "meaning_choice",
                    "difficulty": "medium",
                    "prompt": "Optional의 목적은?",
                    "passage": null,
                    "targetWord": "Optional",
                    "answerFormat": "choice",
                    "choices": [
                      {"id": "A", "text": "null 가능성을 명시적으로 다루기 위함"},
                      {"id": "B", "text": "스레드를 생성하기 위함"}
                    ]
                  }
                ]
                """);
        session.setAnswerKeyJson("""
                {
                  "q1": {
                    "question_type": "meaning_choice",
                    "answer_format": "choice",
                    "correct_choice_id": "A",
                    "explanation": "Optional은 값이 없을 수 있음을 명시합니다."
                  }
                }
                """);
        when(sessionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(any(), any(), any(Pageable.class)))
                .thenReturn(List.of(session));
        when(sessionRepository.save(any(QuizSession.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuizGradeResponse response = service.gradeQuiz(new QuizGradeRequest(
                "st_test",
                List.of(new QuizGradeRequest.AnswerSubmission("q1", "A", ""))
        ));

        assertThat(response.sessionId()).isEqualTo(session.getId().toString());
        assertThat(response.score()).isEqualTo(1);
        assertThat(response.results()).hasSize(1);
        assertThat(response.results().getFirst().status()).isEqualTo("correct");
        assertThat(response.results().getFirst().correctChoiceId()).isEqualTo("A");
        verify(providerFactory, never()).getAvailableProvider();
        verify(sessionRepository).save(eq(session));
    }
}
