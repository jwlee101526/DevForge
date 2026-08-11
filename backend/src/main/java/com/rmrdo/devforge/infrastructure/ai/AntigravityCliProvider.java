package com.rmrdo.devforge.infrastructure.ai;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;
import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;
import com.rmrdo.devforge.application.dto.response.ChoiceDto;
import com.rmrdo.devforge.application.dto.response.QuestionDto;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.application.dto.response.QuizGradeResponse;
import com.rmrdo.devforge.application.port.AiQuizGenerator;
import com.rmrdo.devforge.infrastructure.config.AiProviderProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
/** Antigravity CLI를 실행해 퀴즈를 생성하고 응답 JSON을 애플리케이션 형식으로 변환한다. */
public class AntigravityCliProvider implements AiQuizGenerator {

    private final CliProcessExecutor executor;
    private final AiProviderProperties.AntigravityConfig config;
    private final ObjectMapper objectMapper;
    private final AntigravityPromptFactory promptFactory;

    public AntigravityCliProvider(CliProcessExecutor executor, AiProviderProperties properties, ObjectMapper objectMapper) {
        this.executor = executor;
        this.config = properties.getAntigravity();
        this.objectMapper = objectMapper;
        this.promptFactory = new AntigravityPromptFactory(objectMapper);
    }

    @Override
    public String getProviderName() {
        return "Antigravity";
    }

    @Override
    /** AI 응답을 파싱하고 생성 실패는 호출자에게 그대로 알린다. */
    public QuizGenerateResponse generateQuiz(QuizGenerateRequest request) {
        try {
            String prompt = promptFactory.buildGenerationPrompt(request);
            String output = runAntigravity(prompt);
            String jsonContent = extractJsonContent(output);
            QuizGenerateResponse response = readGenerateResponse(jsonContent);
            if (response.questions() == null || response.questions().isEmpty()) {
                log.warn("AI generate response did not contain questions. Retrying with compact prompt. Parsed JSON: {}", preview(jsonContent));
                output = runAntigravity(promptFactory.buildCompactGenerationPrompt(request));
                jsonContent = extractJsonContent(output);
                response = readGenerateResponse(jsonContent);
            }
            return normalizeQuestionIds(response);
        } catch (JacksonException e) {
            log.error("Failed to parse AI generate response.", e);
            throw new RuntimeException("AI가 생성한 퀴즈 응답을 파싱할 수 없습니다. 다시 시도해 주세요.", e);
        } catch (RuntimeException e) {
            log.error("AI quiz generation failed.", e);
            throw e;
        }
    }

    private QuizGenerateResponse readGenerateResponse(String jsonContent) throws JacksonException {
        // AI별 필드 차이를 흡수하고 화면용 문제와 서버용 정답 키를 분리한다.
        JsonNode root = objectMapper.readTree(jsonContent);
        JsonNode questionRoot = findQuestionRoot(root);
        if (questionRoot == null) {
            questionRoot = root;
        }

        List<QuestionDto> questions = readQuestions(questionRoot);
        if (questions == null || questions.isEmpty()) {
            String answerToken = root.has("answerToken") ? root.get("answerToken").asText(null) : root.path("answer_token").asText(null);
            return new QuizGenerateResponse(new ArrayList<>(), answerToken);
        }
        String answerToken = buildAnswerKeyJson(questionRoot, questions);
        if (answerToken == null) {
            answerToken = root.has("answerToken") ? root.get("answerToken").asText(null) : root.path("answer_token").asText(null);
        }
        return new QuizGenerateResponse(questions, answerToken);
    }

    private JsonNode findQuestionRoot(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        if (node.has("questions") && node.path("questions").isArray()) {
            return node;
        }
        if (node.isTextual()) {
            return findQuestionRootFromText(node.asText());
        }
        if (node.isArray()) {
            for (JsonNode child : node) {
                JsonNode found = findQuestionRoot(child);
                if (found != null) {
                    return found;
                }
            }
        }

        String[] wrapperFields = {"result", "response", "content", "text", "message", "output", "stdout", "data"};
        for (String field : wrapperFields) {
            JsonNode child = node.get(field);
            JsonNode found = findQuestionRoot(child);
            if (found != null) {
                return found;
            }
        }

        String[] arrayWrapperFields = {"results", "items", "messages", "events", "outputs"};
        for (String field : arrayWrapperFields) {
            JsonNode child = node.get(field);
            JsonNode found = findQuestionRoot(child);
            if (found != null) {
                return found;
            }
        }

        return null;
    }

    private JsonNode findQuestionRootFromText(String text) {
        String nestedJson = extractJsonFromText(text);
        if (nestedJson.isBlank()) {
            return null;
        }
        JsonNode nestedRoot = tryReadJson(nestedJson);
        return findQuestionRoot(nestedRoot);
    }

    private String buildAnswerKeyJson(JsonNode root, List<QuestionDto> questions) {
        // 정답은 생성 응답에 포함될 수 있지만 사용자 응답 DTO에는 노출하지 않는다.
        JsonNode questionNodes = root.path("questions");
        if (!questionNodes.isArray()) {
            return null;
        }

        ObjectNode answerKey = objectMapper.createObjectNode();
        boolean hasAnswer = false;
        int index = 0;
        for (JsonNode node : questionNodes) {
            if (index >= questions.size()) {
                break;
            }

            QuestionDto question = questions.get(index);
            String answerText = nullableText(node, "answer");
            String correctChoiceId = nullableText(node, "correct_choice_id");
            if (correctChoiceId == null) {
                correctChoiceId = nullableText(node, "correctChoiceId");
            }
            if (correctChoiceId == null && answerText != null) {
                correctChoiceId = findChoiceIdByText(question.choices(), answerText);
            }

            String correctText = nullableText(node, "correct_text");
            if (correctText == null) {
                correctText = nullableText(node, "correctText");
            }
            if (correctText == null && "text".equals(question.answerFormat())) {
                correctText = answerText;
            }

            if (correctChoiceId != null || correctText != null) {
                ObjectNode answerNode = objectMapper.createObjectNode();
                answerNode.put("question_type", question.questionType());
                answerNode.put("answer_format", question.answerFormat());
                if (correctChoiceId != null) {
                    answerNode.put("correct_choice_id", correctChoiceId);
                }
                if (correctText != null) {
                    answerNode.put("correct_text", correctText);
                }
                String explanation = nullableText(node, "explanation");
                if (explanation != null) {
                    answerNode.put("explanation", explanation);
                }
                answerKey.set(question.id(), answerNode);
                hasAnswer = true;
            }
            index++;
        }

        if (!hasAnswer) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(answerKey);
        } catch (JacksonException e) {
            log.warn("Failed to serialize AI answer key.", e);
            return null;
        }
    }

    private String findChoiceIdByText(List<ChoiceDto> choices, String answerText) {
        if (choices == null || answerText == null) {
            return null;
        }
        String normalizedAnswer = normalizeAnswerText(answerText);
        for (ChoiceDto choice : choices) {
            if (normalizedAnswer.equals(normalizeAnswerText(choice.text()))) {
                return choice.id();
            }
        }
        return null;
    }

    private String normalizeAnswerText(String text) {
        return text == null ? "" : text.replaceAll("\\s+", " ").trim();
    }

    private List<QuestionDto> readQuestions(JsonNode root) {
        JsonNode questionNodes = root.path("questions");
        if (!questionNodes.isArray()) {
            return new ArrayList<>();
        }

        List<QuestionDto> questions = new ArrayList<>();
        int index = 1;
        for (JsonNode node : questionNodes) {
            String id = text(node, "id", "q" + index);
            String questionType = text(node, "question_type", text(node, "questionType", "meaning_choice"));
            String difficulty = text(node, "difficulty", "medium");
            String prompt = text(node, "prompt", text(node, "question", ""));
            String passage = nullableText(node, "passage");
            String targetWord = text(node, "target_word", text(node, "targetWord", extractConceptFromPrompt(prompt)));
            String answerFormat = text(node, "answer_format", text(node, "answerFormat", "choice"));
            List<ChoiceDto> choices = readChoices(node);

            questions.add(new QuestionDto(id, questionType, difficulty, prompt, passage, targetWord, answerFormat, choices));
            index++;
        }
        return questions;
    }

    private List<ChoiceDto> readChoices(JsonNode questionNode) {
        JsonNode choiceNodes = questionNode.has("choices") ? questionNode.get("choices") : questionNode.get("options");
        if (!choiceNodes.isArray()) {
            return new ArrayList<>();
        }

        List<ChoiceDto> choices = new ArrayList<>();
        int index = 0;
        for (JsonNode choiceNode : choiceNodes) {
            String id = String.valueOf((char) ('A' + index));
            String text;
            if (choiceNode.isTextual()) {
                text = choiceNode.asText();
            } else {
                id = text(choiceNode, "id", id);
                text = text(choiceNode, "text", "");
            }
            choices.add(new ChoiceDto(id, text));
            index++;
        }
        return choices;
    }

    private String text(JsonNode node, String fieldName, String fallback) {
        JsonNode value = node.get(fieldName);
        return value != null && !value.isNull() ? value.asText(fallback) : fallback;
    }

    private String nullableText(JsonNode node, String fieldName) {
        JsonNode value = node.get(fieldName);
        return value != null && !value.isNull() ? value.asText() : null;
    }

    private String extractConceptFromPrompt(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return "개발 지식";
        }
        String[] tokens = prompt.split("[^A-Za-z0-9_.$#/-]+");
        for (String token : tokens) {
            if (token.length() >= 3 && Character.isUpperCase(token.charAt(0))) {
                return token;
            }
        }
        return "개발 지식";
    }

    private QuizGenerateResponse normalizeQuestionIds(QuizGenerateResponse response) {
        List<QuestionDto> questions = response.questions();
        if (questions == null || questions.isEmpty()) {
            throw new RuntimeException("AI가 퀴즈 문제를 생성하지 않았습니다. 다시 시도해 주세요.");
        }

        boolean needsIds = questions.stream().anyMatch(q -> q.id() == null || q.id().isEmpty());
        if (!needsIds) {
            return response;
        }

        List<QuestionDto> updatedQuestions = new ArrayList<>();
        for (int i = 0; i < questions.size(); i++) {
            QuestionDto q = questions.get(i);
            String id = (q.id() == null || q.id().isEmpty()) ? "q" + (i + 1) : q.id();
            updatedQuestions.add(new QuestionDto(
                    id, q.questionType(), q.difficulty(), q.prompt(),
                    q.passage(), q.targetWord(), q.answerFormat(), q.choices()
            ));
        }
        return new QuizGenerateResponse(updatedQuestions, response.answerToken());
    }

    @Override
    /** 제출 답안을 AI 채점 형식으로 요청하고 JSON 결과를 변환한다. */
    public QuizGradeResponse gradeQuiz(QuizGradeRequest request) {
        String prompt = promptFactory.buildGradingPrompt(request);
        String output = runAntigravity(prompt);
        String jsonContent = extractJsonContent(output);

        try {
            return objectMapper.readValue(jsonContent, QuizGradeResponse.class);
        } catch (JacksonException e) {
            log.error("Failed to parse AI grade response: {}", jsonContent, e);
            throw new RuntimeException("채점 결과를 파싱할 수 없습니다. 다시 시도해 주세요.", e);
        }
    }

    @Override
    public boolean isAvailable() {
        try {
            ensurePermissionConfig();
            executor.execute(config.getExecutablePath(), List.of("--help"), null, 10, config.getEnv(), false);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String runAntigravity(String prompt) {
        // 옵션을 프롬프트보다 먼저 전달해 CLI가 프롬프트를 옵션 값으로 오인하지 않게 한다.
        ensurePermissionConfig();
        List<String> args = new ArrayList<>(Arrays.asList(
                "--output-format",
                "json",
                "--disable-slash-commands",
                "--dangerously-skip-permissions"
        ));
        if (config.getLogFile() != null && !config.getLogFile().isBlank()) {
            args.add("--log-file");
            args.add(config.getLogFile());
        }
        if (config.getModel() != null && !config.getModel().isEmpty()) {
            args.add("--model");
            args.add(config.getModel());
        }
        args.add("--print");
        args.add(prompt);
        return executor.execute(config.getExecutablePath(), args, null, config.getTimeoutSeconds(), config.getEnv());
    }

    private void ensurePermissionConfig() {
        if (!config.isAutoConfigurePermissions()) {
            return;
        }
        List<String> allowRules = config.getPermissionAllow();
        if (allowRules == null || allowRules.isEmpty()) {
            return;
        }

        Path configPath = sharedConfigPath();
        try {
            Files.createDirectories(configPath.getParent());

            ObjectNode root;
            if (Files.exists(configPath) && Files.size(configPath) > 0) {
                JsonNode existing = objectMapper.readTree(Files.readString(configPath));
                root = existing instanceof ObjectNode objectNode ? objectNode : objectMapper.createObjectNode();
            } else {
                root = objectMapper.createObjectNode();
            }

            boolean changed = addAllowRules(objectNode(root, "permissions"), allowRules);
            changed = addAllowRules(objectNode(objectNode(root, "userSettings"), "permissions"), allowRules) || changed;

            if (changed) {
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(configPath.toFile(), root);
                log.info("Updated Antigravity permission config: {}", configPath);
            }
        } catch (Exception e) {
            log.warn("Failed to update Antigravity permission config: {}", configPath, e);
        }
    }

    private Path sharedConfigPath() {
        if (config.getSharedConfigPath() != null && !config.getSharedConfigPath().isBlank()) {
            return Path.of(config.getSharedConfigPath());
        }
        return Path.of(System.getProperty("user.home"), ".gemini", "antigravity-cli", "settings.json");
    }

    private ObjectNode objectNode(ObjectNode parent, String fieldName) {
        JsonNode node = parent.get(fieldName);
        if (node instanceof ObjectNode objectNode) {
            return objectNode;
        }
        ObjectNode objectNode = objectMapper.createObjectNode();
        parent.set(fieldName, objectNode);
        return objectNode;
    }

    private boolean addAllowRules(ObjectNode permissions, List<String> allowRules) {
        ArrayNode allow = arrayNode(permissions, "allow");
        boolean changed = false;
        for (String rule : allowRules) {
            if (rule == null || rule.isBlank() || containsText(allow, rule)) {
                continue;
            }
            allow.add(rule);
            changed = true;
        }
        return changed;
    }

    private ArrayNode arrayNode(ObjectNode parent, String fieldName) {
        JsonNode node = parent.get(fieldName);
        if (node instanceof ArrayNode arrayNode) {
            return arrayNode;
        }
        ArrayNode arrayNode = objectMapper.createArrayNode();
        parent.set(fieldName, arrayNode);
        return arrayNode;
    }

    private boolean containsText(ArrayNode array, String value) {
        for (JsonNode node : array) {
            if (value.equals(node.asText())) {
                return true;
            }
        }
        return false;
    }

    private String extractJsonContent(String raw) {
        // 순수 JSON, result 래퍼, 마크다운 코드블록, 일반 텍스트 속 JSON을 순서대로 처리한다.
        String trimmed = raw.trim();
        JsonNode root = tryReadJson(trimmed);
        if (root != null && root.has("result")) {
            String resultText = root.get("result").asText();
            String json = extractJsonFromText(resultText);
            if (json.isBlank()) {
                log.warn("AI result did not contain JSON. Preview: {}", preview(resultText));
                throw new RuntimeException("AI가 JSON 형식으로 응답하지 않았습니다. 다시 시도해 주세요.");
            }
            return json;
        }
        if (root != null && (root.has("questions") || root.has("results"))) {
            return trimmed;
        }

        String json = extractJsonFromText(trimmed);
        if (json.isBlank() || json.equals(trimmed) && !looksLikeJson(json)) {
            log.warn("AI response did not contain JSON. Preview: {}", preview(trimmed));
            throw new RuntimeException("AI가 JSON 형식으로 응답하지 않았습니다. 다시 시도해 주세요.");
        }
        return json;
    }

    private JsonNode tryReadJson(String text) {
        try {
            return objectMapper.readTree(text);
        } catch (Exception e) {
            return null;
        }
    }

    private String extractJsonFromText(String text) {
        String codeBlockJson = extractJsonCodeBlock(text);
        if (!codeBlockJson.isBlank()) {
            return codeBlockJson;
        }

        String objectJson = extractBalancedJson(text, '{', '}');
        if (!objectJson.isBlank()) {
            return objectJson;
        }

        return extractBalancedJson(text, '[', ']');
    }

    private String extractJsonCodeBlock(String text) {
        int fenceStart = text.indexOf("```");
        while (fenceStart >= 0) {
            int contentStart = text.indexOf('\n', fenceStart + 3);
            if (contentStart < 0) {
                return "";
            }

            int fenceEnd = text.indexOf("```", contentStart + 1);
            if (fenceEnd < 0) {
                return "";
            }

            String content = text.substring(contentStart + 1, fenceEnd).trim();
            if (looksLikeJson(content)) {
                return content;
            }
            fenceStart = text.indexOf("```", fenceEnd + 3);
        }
        return "";
    }

    private String extractBalancedJson(String text, char open, char close) {
        int start = text.indexOf(open);
        while (start >= 0) {
            int depth = 0;
            boolean inString = false;
            boolean escaped = false;

            for (int i = start; i < text.length(); i++) {
                char ch = text.charAt(i);

                if (inString) {
                    if (escaped) {
                        escaped = false;
                    } else if (ch == '\\') {
                        escaped = true;
                    } else if (ch == '"') {
                        inString = false;
                    }
                    continue;
                }

                if (ch == '"') {
                    inString = true;
                } else if (ch == open) {
                    depth++;
                } else if (ch == close) {
                    depth--;
                    if (depth == 0) {
                        String candidate = text.substring(start, i + 1).trim();
                        if (isValidJson(candidate)) {
                            return candidate;
                        }
                        break;
                    }
                }
            }
            start = text.indexOf(open, start + 1);
        }
        return "";
    }

    private boolean looksLikeJson(String text) {
        String trimmed = text.trim();
        return trimmed.startsWith("{") || trimmed.startsWith("[");
    }

    private boolean isValidJson(String text) {
        try {
            objectMapper.readTree(text);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String preview(String text) {
        String normalized = text.replaceAll("\\s+", " ").trim();
        return normalized.length() <= 500 ? normalized : normalized.substring(0, 500) + "...";
    }

}
