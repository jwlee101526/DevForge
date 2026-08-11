package com.rmrdo.devforge.infrastructure.ai;

import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.infrastructure.config.AiProviderProperties;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import tools.jackson.databind.ObjectMapper;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AntigravityCliProviderTest {

    @TempDir
    Path tempDir;

    @Test
    void generateQuizParsesJsonInsideAgyResultText() {
        CapturingExecutor executor = new CapturingExecutor("""
                {
                  "result": "```json\\n{\\\"questions\\\":[{\\\"id\\\":\\\"q1\\\",\\\"questionType\\\":\\\"meaning_choice\\\",\\\"difficulty\\\":\\\"medium\\\",\\\"prompt\\\":\\\"Optional의 목적은?\\\",\\\"passage\\\":null,\\\"targetWord\\\":\\\"Optional\\\",\\\"answerFormat\\\":\\\"choice\\\",\\\"choices\\\":[{\\\"id\\\":\\\"A\\\",\\\"text\\\":\\\"null 가능성을 명시적으로 다루기 위함\\\"},{\\\"id\\\":\\\"B\\\",\\\"text\\\":\\\"스레드를 생성하기 위함\\\"},{\\\"id\\\":\\\"C\\\",\\\"text\\\":\\\"SQL을 실행하기 위함\\\"},{\\\"id\\\":\\\"D\\\",\\\"text\\\":\\\"빈 생성을 막기 위함\\\"}]}]}\\n```"
                }
                """);
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties(), new ObjectMapper());

        QuizGenerateResponse response = provider.generateQuiz(request());

        assertThat(response.questions()).hasSize(1);
        assertThat(response.questions().getFirst().id()).isEqualTo("q1");
        assertThat(response.questions().getFirst().questionType()).isEqualTo("meaning_choice");
    }

    @Test
    void generateQuizNormalizesAgyOptionsToChoices() {
        CapturingExecutor executor = new CapturingExecutor("""
                {
                  "questions": [
                    {
                      "id": "q1",
                      "question_type": "meaning_choice",
                      "difficulty": "medium",
                      "prompt": "What is the primary design purpose of Java's java.util.Optional<T> container introduced in Java 8?",
                      "options": [
                        "To automatically intercept and suppress NullPointerExceptions at runtime across the application.",
                        "To provide a type-level mechanism for representing optional return values to help prevent NullPointerExceptions.",
                        "To enforce compile-time immutability on object references returned from methods.",
                        "To replace traditional exception handling for method calls that fail due to missing data."
                      ],
                      "answer": "To provide a type-level mechanism for representing optional return values to help prevent NullPointerExceptions.",
                      "explanation": "Optional represents absent values explicitly."
                    }
                  ]
                }
                """);
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties(), new ObjectMapper());

        QuizGenerateResponse response = provider.generateQuiz(request());

        assertThat(response.questions()).hasSize(1);
        assertThat(response.questions().getFirst().choices()).hasSize(4);
        assertThat(response.questions().getFirst().choices().getFirst().id()).isEqualTo("A");
        assertThat(response.questions().getFirst().answerFormat()).isEqualTo("choice");
        assertThat(response.questions().getFirst().targetWord()).isEqualTo("What");
        assertThat(response.answerToken()).contains("\"correct_choice_id\":\"B\"");
    }

    @Test
    void generateQuizParsesJsonInsideNestedAgyResultsContent() {
        CapturingExecutor executor = new CapturingExecutor("""
                {
                  "type": "result",
                  "results": [
                    {
                      "content": "```json\\n{\\\"questions\\\":[{\\\"id\\\":\\\"q1\\\",\\\"question_type\\\":\\\"usage_choice\\\",\\\"difficulty\\\":\\\"hard\\\",\\\"prompt\\\":\\\"N+1 쿼리를 줄이는 방법은?\\\",\\\"passage\\\":\\\"@OneToMany List<OrderItem> items;\\\",\\\"target_word\\\":\\\"fetch join\\\",\\\"answer_format\\\":\\\"choice\\\",\\\"choices\\\":[{\\\"id\\\":\\\"A\\\",\\\"text\\\":\\\"fetch join을 사용한다\\\"},{\\\"id\\\":\\\"B\\\",\\\"text\\\":\\\"인덱스를 모두 삭제한다\\\"},{\\\"id\\\":\\\"C\\\",\\\"text\\\":\\\"트랜잭션을 제거한다\\\"},{\\\"id\\\":\\\"D\\\",\\\"text\\\":\\\"엔티티 이름을 바꾼다\\\"}],\\\"correct_choice_id\\\":\\\"A\\\",\\\"correct_text\\\":null,\\\"explanation\\\":\\\"fetch join은 연관 엔티티를 함께 조회해 추가 쿼리를 줄입니다.\\\"}]}\\n```"
                    }
                  ]
                }
                """);
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties(), new ObjectMapper());

        QuizGenerateResponse response = provider.generateQuiz(request());

        assertThat(response.questions()).hasSize(1);
        assertThat(response.questions().getFirst().questionType()).isEqualTo("usage_choice");
        assertThat(response.answerToken()).contains("\"correct_choice_id\":\"A\"");
    }

    @Test
    void generateQuizThrowsWhenAgyResultDoesNotContainJson() {
        CapturingExecutor executor = new CapturingExecutor("""
                {"result":"Could you provide the quiz requirements?"}
                """);
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties(), new ObjectMapper());

        assertThatThrownBy(() -> provider.generateQuiz(request()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("JSON");
    }

    @Test
    void generateQuizThrowsWhenAgyReturnsNoQuestionsTwice() {
        CapturingExecutor executor = new CapturingExecutor(
                """
                {"result":"{\\"answer_token\\":\\"token-only\\"}"}
                """,
                """
                {"result":"{\\"questions\\":[]}"}
                """);
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties(), new ObjectMapper());

        assertThatThrownBy(() -> provider.generateQuiz(request()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("AI가 퀴즈 문제를 생성하지 않았습니다");
        assertThat(executor.capturedArguments).hasSize(2);
    }

    @Test
    void generateQuizRetriesWithCompactPromptWhenAgyReturnsNoQuestions() {
        CapturingExecutor executor = new CapturingExecutor(
                """
                {"questions":[]}
                """,
                """
                {"questions":[{"id":"q1","questionType":"meaning_choice","difficulty":"medium","prompt":"Optional의 목적은?","passage":null,"targetWord":"Optional","answerFormat":"choice","choices":[]}]}
                """
        );
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties(), new ObjectMapper());

        QuizGenerateResponse response = provider.generateQuiz(request());

        assertThat(response.questions()).hasSize(1);
        assertThat(executor.capturedArguments).hasSize(2);
        assertThat(executor.capturedArguments.get(1).getLast()).contains("Return only one valid JSON object");
    }

    @Test
    void generateQuizPassesPromptLogFileAndEnvToAgyProcess() {
        CapturingExecutor executor = new CapturingExecutor("""
                {"questions":[{"id":"q1","questionType":"meaning_choice","difficulty":"medium","prompt":"Optional의 목적은?","passage":null,"targetWord":"Optional","answerFormat":"choice","choices":[]}]}
                """);
        AiProviderProperties properties = properties();
        properties.getAntigravity().setLogFile("./build/agy-test.log");
        properties.getAntigravity().setEnv(Map.of("GEMINI_API_KEY", "test-key"));
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties, new ObjectMapper());

        provider.generateQuiz(request());

        assertThat(executor.arguments).contains("--print", "--output-format", "json", "--disable-slash-commands", "--log-file", "./build/agy-test.log");
        assertThat(executor.arguments).doesNotContain("--json-schema");
        assertThat(executor.arguments.get(executor.arguments.indexOf("--print") + 1)).contains("당신은 개발 지식 퀴즈 생성기입니다.");
        assertThat(executor.arguments.getLast()).contains("당신은 개발 지식 퀴즈 생성기입니다.");
        assertThat(executor.environment).containsEntry("GEMINI_API_KEY", "test-key");
    }

    @Test
    void generateQuizAddsConfiguredPermissionAllowRule() throws Exception {
        CapturingExecutor executor = new CapturingExecutor("""
                {"questions":[{"id":"q1","questionType":"meaning_choice","difficulty":"medium","prompt":"Optional의 목적은?","passage":null,"targetWord":"Optional","answerFormat":"choice","choices":[]}]}
                """);
        Path configPath = tempDir.resolve("config.json");
        Files.writeString(configPath, """
                {
                  "userSettings": {
                    "remoteControlHostname": "test"
                  }
                }
                """);
        AiProviderProperties properties = properties();
        properties.getAntigravity().setSharedConfigPath(configPath.toString());
        properties.getAntigravity().setPermissionAllow(List.of("command(agy --help)"));
        AntigravityCliProvider provider = new AntigravityCliProvider(executor, properties, new ObjectMapper());

        provider.generateQuiz(request());

        String configJson = Files.readString(configPath);
        assertThat(configJson).contains("\"permissions\"", "\"allow\"", "command(agy --help)");
        assertThat(configJson.indexOf("command(agy --help)")).isNotEqualTo(configJson.lastIndexOf("command(agy --help)"));
    }

    private static AiProviderProperties properties() {
        AiProviderProperties properties = new AiProviderProperties();
        properties.getAntigravity().setExecutablePath("agy");
        properties.getAntigravity().setTimeoutSeconds(300);
        return properties;
    }

    private static QuizGenerateRequest request() {
        return new QuizGenerateRequest(
                "random",
                "Java",
                true,
                List.of(),
                false,
                false,
                null,
                null,
                "Optional 1문제",
                1,
                Map.of("meaning_choice", 1)
        );
    }

    private static QuizGenerateRequest request(int count) {
        return new QuizGenerateRequest(
                "random",
                "Java",
                true,
                List.of(),
                false,
                false,
                null,
                null,
                "Optional %d문제".formatted(count),
                count,
                Map.of("meaning_choice", count)
        );
    }

    private static class CapturingExecutor extends CliProcessExecutor {
        private final Deque<String> outputs;
        private final List<List<String>> capturedArguments = new ArrayList<>();
        private List<String> arguments;
        private Map<String, String> environment;

        private CapturingExecutor(String... outputs) {
            this.outputs = new ArrayDeque<>(List.of(outputs));
        }

        @Override
        public String execute(String executable, List<String> arguments, String stdinInput, int timeoutSeconds, Map<String, String> environment) {
            this.arguments = arguments;
            this.capturedArguments.add(arguments);
            this.environment = environment;
            return outputs.isEmpty() ? "" : outputs.removeFirst();
        }
    }
}
