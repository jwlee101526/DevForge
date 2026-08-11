package com.rmrdo.devforge.infrastructure.ai;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.request.QuizGradeRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/** Antigravity에 전달할 생성·재시도·채점 프롬프트를 만든다. */
public class AntigravityPromptFactory {

    private final ObjectMapper objectMapper;

    public AntigravityPromptFactory(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /** 전체 요구사항을 포함한 기본 퀴즈 생성 프롬프트를 만든다. */
    public String buildGenerationPrompt(QuizGenerateRequest request) {
        String typeCountsDesc = "";
        if (request.questionTypeCounts() != null && !request.questionTypeCounts().isEmpty()) {
            typeCountsDesc = request.questionTypeCounts().entrySet().stream()
                    .filter(e -> e.getValue() != null && e.getValue() > 0)
                    .map(e -> e.getKey() + ": " + e.getValue() + "문제")
                    .collect(Collectors.joining(", "));
        }
        if (typeCountsDesc.isEmpty()) {
            typeCountsDesc = "총 " + request.questionCount() + "문제 (유형 혼합)";
        }

        String scopeDesc;
        if (request.scopeAll()) {
            scopeDesc = "전체 범위";
        } else {
            List<String> parts = new ArrayList<>();
            if (request.scopeTags() != null) {
                request.scopeTags().forEach(t -> parts.add("태그:" + t));
            }
            if (request.scopeDue()) parts.add("복습 예정 항목");
            if (request.scopeSavedDate()) parts.add("저장 기간: " + request.savedFrom() + "~" + request.savedTo());
            scopeDesc = String.join(", ", parts);
        }

        String customInstruction = (request.instruction() != null && !request.instruction().isEmpty())
                ? "\n\n추가 지시사항: " + request.instruction()
                : "";

        return """
당신은 개발 지식 퀴즈 생성기입니다.
아래 요구사항에 맞는 실무형 개발 지식 퀴즈를 생성하세요.
절대 Bash, 터미널, command 도구, 파일 도구를 사용하지 마세요.
사용자에게 추가 질문을 하지 마세요. 요구사항에 맞춰 퀴즈를 생성하세요.

## 요구사항
- 범위: %s
- 문제 구성: %s
- 총 문제 수: %d
%s

## 문제 유형 설명
- meaning_choice: 개념의 의미·목적·트레이드오프를 묻는 4지선다 (answer_format: "choice")
- context_choice: 코드, 로그, 설정, SQL, HTTP 요청 같은 문맥에서 빈칸이나 다음 동작을 고르는 4지선다 (answer_format: "choice")
- collocation_choice: 함께 쓰이는 API, 애노테이션, 패턴, 자료구조, 설정 조합을 고르는 4지선다 (answer_format: "choice")
- usage_choice: 버그 수정, 리팩터링, 성능 개선, 운영 대응처럼 실제 적용 방법을 고르는 4지선다 (answer_format: "choice")
- short_answer: 명령어, 키워드, API명, 예외명, 짧은 원인을 답하는 단답형 (answer_format: "text", choices는 빈 배열)
- sentence_answer: 코드/설정의 문제점이나 개선 방향을 1~3문장으로 설명하는 서술형 (answer_format: "text", choices는 빈 배열)

## 응답 형식
반드시 아래 JSON 객체 하나만 응답하세요. 마크다운 코드블록, 주석, 접두사, 접미사는 절대 포함하지 마세요.

{
  "questions": [
    {
      "id": "q1",
      "question_type": "meaning_choice",
      "difficulty": "medium",
      "prompt": "문제 텍스트",
      "passage": "지문 또는 코드 스니펫 (선택사항, 없으면 null)",
      "target_word": "핵심 개념어",
      "answer_format": "choice",
      "choices": [
        {"id": "A", "text": "선택지 1"},
        {"id": "B", "text": "선택지 2"},
        {"id": "C", "text": "선택지 3"},
        {"id": "D", "text": "선택지 4"}
      ],
      "correct_choice_id": "A",
      "correct_text": null,
      "explanation": "정답 근거와 오답이 틀린 이유를 2~4문장으로 설명"
    }
  ]
}

중요 규칙:
1. id는 q1, q2, q3... 순서로 부여
2. 4지선다의 choices id는 A, B, C, D
3. 주관식(short_answer, sentence_answer)은 choices를 빈 배열 []로
4. difficulty는 easy, medium, hard, challenge 중 하나
5. passage는 context_choice, usage_choice, sentence_answer에 적극적으로 포함하고, 없으면 null
6. 개발 지식(Java, Spring, React, DB, OS, 네트워크, 알고리즘 등) 기반 문제를 생성
7. 각 문제의 target_word는 모두 다르게 작성
8. 같은 prompt, 같은 선택지 조합, 같은 정답 패턴을 반복하지 않기
9. 선택지는 모두 그럴듯해야 하며 명백한 농담, 범위 밖 기술, 무의미한 선택지를 넣지 않기
10. 4지선다는 correct_choice_id를 반드시 포함하고 correct_text는 null
11. 주관식은 correct_text를 반드시 포함하고 correct_choice_id는 null
12. explanation은 정답 근거와 핵심 오개념을 포함
13. 정답 필드는 서버가 분리 저장하므로 문제 품질을 위해 반드시 포함
""".formatted(scopeDesc, typeCountsDesc, request.questionCount(), customInstruction);
    }

    /** 기본 프롬프트가 실패했을 때 사용하는 짧은 재시도 프롬프트를 만든다. */
    public String buildCompactGenerationPrompt(QuizGenerateRequest request) {
        int count = Math.max(1, request.questionCount());
        String topic = request.tag() != null && !request.tag().isBlank() ? request.tag() : "software engineering";
        if (request.scopeTags() != null && !request.scopeTags().isEmpty()) {
            topic = String.join(", ", request.scopeTags());
        }
        String instruction = request.instruction() != null && !request.instruction().isBlank()
                ? request.instruction()
                : "Create developer knowledge quiz questions.";

        return """
Return only one valid JSON object. Do not use tools. Do not ask questions. Generate the quiz now.
Topic: %s
Question count: %d
Instruction: %s
Generate exactly %d distinct questions. Do not reuse the same concept, prompt, or choices across questions.
Mix requested question types when possible. Include realistic code, configuration, SQL, HTTP, or debugging context for non-definition question types.
For every choice question include correct_choice_id and explanation. For every text question include correct_text and explanation.
Use sequential ids from q1 to q%d.
Required JSON shape:
{"questions":[{"id":"q1","question_type":"meaning_choice","difficulty":"medium","prompt":"question text","passage":null,"target_word":"concept","answer_format":"choice","choices":[{"id":"A","text":"option A"},{"id":"B","text":"option B"},{"id":"C","text":"option C"},{"id":"D","text":"option D"}],"correct_choice_id":"A","correct_text":null,"explanation":"answer explanation"}]}
""".formatted(topic, count, instruction, count, count);
    }

    /** 제출된 답안을 기준으로 JSON 채점 결과를 요청하는 프롬프트를 만든다. */
    public String buildGradingPrompt(QuizGradeRequest request) {
        String answersJson;
        try {
            answersJson = objectMapper.writeValueAsString(request.answers());
        } catch (JacksonException e) {
            answersJson = "[]";
        }

        return """
당신은 개발 지식 퀴즈 채점관입니다.
아래 퀴즈에 대한 사용자의 답변을 채점하세요.
절대 Bash, 터미널, command 도구, 파일 도구를 사용하지 마세요.
사용자에게 추가 질문을 하지 마세요.

## 사용자 답변
%s

## 응답 형식
반드시 아래 JSON 객체 하나만 응답하세요. 마크다운 코드블록, 설명, 주석, 접두사, 접미사는 절대 포함하지 마세요.

{
  "score": 3,
  "type_stats": {
    "meaning_choice": {"accuracy": 1.0, "count": 2},
    "short_answer": {"accuracy": 0.5, "count": 1}
  },
  "results": [
    {
      "question_id": "q1",
      "status": "correct",
      "correct_choice_id": "A",
      "explanation": "정답 해설",
      "can_add_to_wordbook": false
    },
    {
      "question_id": "q2",
      "status": "incorrect",
      "correct_choice_id": "B",
      "explanation": "정답 해설",
      "can_add_to_wordbook": true,
      "suggested_word": "틀린 개념명",
      "suggested_korean": "개념 설명",
      "suggested_tag": "태그"
    },
    {
      "question_id": "q3",
      "status": "incorrect",
      "correct_text": "정답 텍스트",
      "acceptable_answers": ["정답1", "정답2"],
      "explanation": "정답 해설",
      "can_add_to_wordbook": true,
      "suggested_word": "개념명",
      "suggested_korean": "개념 설명"
    }
  ]
}

채점 규칙:
1. status: correct(정답), partial(부분 정답), incorrect(오답)
2. 4지선다는 correct_choice_id로 정답 표시
3. 주관식은 correct_text와 acceptable_answers로 정답 표시
4. 오답이거나 부분 정답인 문제는 can_add_to_wordbook: true로 설정
5. can_add_to_wordbook이 true인 경우 suggested_word, suggested_korean, suggested_tag 포함
6. score는 정답 개수 (partial은 0.5로 계산 후 반올림)
7. type_stats는 문제 유형별 정답률과 문제 수
8. 각 문제에 대해 explanation(해설)을 반드시 포함
""".formatted(answersJson);
    }
}
