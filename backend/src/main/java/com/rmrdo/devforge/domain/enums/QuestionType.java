package com.rmrdo.devforge.domain.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
/** 퀴즈 문제 유형 도메인 열거형 */
public enum QuestionType {

    MEANING_CHOICE("meaning_choice", "개념/용어 사지선다", "choice"),
    CONTEXT_CHOICE("context_choice", "코드 빈칸 사지선다", "choice"),
    COLLOCATION_CHOICE("collocation_choice", "키워드/조합 사지선다", "choice"),
    USAGE_CHOICE("usage_choice", "실무 활용 코드 사지선다", "choice"),
    SHORT_ANSWER("short_answer", "단답형 주관식", "short_answer"),
    SENTENCE_ANSWER("sentence_answer", "코드/서술형 주관식", "sentence_answer");

    private final String code;
    private final String koreanTitle;
    private final String answerFormat;

    public static QuestionType fromCode(String code) {
        if (code == null) return MEANING_CHOICE;
        for (QuestionType type : values()) {
            if (type.code.equalsIgnoreCase(code.trim())) {
                return type;
            }
        }
        return MEANING_CHOICE;
    }
}
