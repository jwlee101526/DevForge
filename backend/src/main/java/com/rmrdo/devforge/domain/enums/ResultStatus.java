package com.rmrdo.devforge.domain.enums;

/** 사용자의 문제 풀이 결과 상태를 정의한다. */
public enum ResultStatus {
    /** 정답으로 처리된 상태. */
    CORRECT,
    /** 일부만 맞아 부분 정답으로 처리된 상태. */
    PARTIAL,
    /** 정답이 아닌 상태. */
    INCORRECT
}
