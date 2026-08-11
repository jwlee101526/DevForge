package com.rmrdo.devforge.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Lob;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quiz_sessions", indexes = {
    @Index(name = "idx_quiz_session_created_at", columnList = "createdAt")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/** 퀴즈 생성부터 제출 및 채점 결과까지 한 세션의 상태를 저장한다. */
public class QuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private int totalQuestions;

    private int score;

    @Column(length = 100)
    private String tag;

    @Lob
    /** 사용자에게 반환할 문제 목록을 JSON으로 저장한다. */
    @Builder.Default
    private String questionsJson = "[]";

    @Lob
    /** 사용자가 제출한 답안을 JSON으로 저장한다. */
    @Builder.Default
    private String answersJson = "{}";

    @Lob
    /** 외부에 노출하지 않는 정답 정보로 서버 채점에 사용한다. */
    private String answerKeyJson;

    @Lob
    private String gradeResultJson;

    @Column(length = 200)
    private String answerToken;

    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    /** 신규 세션 저장 시 생성 시각과 JSON 기본값을 보장한다. */
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (questionsJson == null) {
            questionsJson = "[]";
        }
        if (answersJson == null) {
            answersJson = "{}";
        }
    }
}
