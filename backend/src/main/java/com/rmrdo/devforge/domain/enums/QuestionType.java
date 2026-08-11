package com.rmrdo.devforge.domain.enums;

/** 퀴즈에서 제공하는 문제 유형을 정의한다. */
public enum QuestionType {
    /** 개념의 의미를 고르는 4지선다 문제. */
    MEANING_CHOICE,
    /** 코드나 문맥에 알맞은 답을 고르는 문제. */
    CONTEXT_CHOICE,
    /** 함께 사용되는 기술이나 개념 조합을 고르는 문제. */
    COLLOCATION_CHOICE,
    /** 실제 사용법이나 적용 방법을 고르는 문제. */
    USAGE_CHOICE,
    /** 짧은 답을 작성하는 주관식 문제. */
    SHORT_ANSWER,
    /** 문장 형태로 답을 작성하는 서술형 문제. */
    SENTENCE_ANSWER
}
