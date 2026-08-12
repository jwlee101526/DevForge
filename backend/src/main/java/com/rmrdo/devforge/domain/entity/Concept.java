package com.rmrdo.devforge.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "concepts", indexes = {
    @Index(name = "idx_concept_word", columnList = "word"),
    @Index(name = "idx_concept_tag", columnList = "tag"),
    @Index(name = "idx_concept_user_scope", columnList = "userId,scope")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/** 복습과 통계에 사용하는 개발 개념 및 학습 이력을 저장한다. */
public class Concept {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(length = 20)
    @Builder.Default
    private String scope = "PERSONAL";

    @Column(length = 500, nullable = false)
    @Builder.Default
    private String word = "";

    @Column(length = 1000)
    private String korean;

    @Column(length = 2000)
    private String englishDef;

    @Column(length = 2000)
    private String example;

    @Column(length = 100)
    @Builder.Default
    private String tag = "";

    private LocalDateTime createdAt;

    private LocalDateTime nextReview;

    private int attemptCount;

    private int incorrectCount;

    private LocalDateTime lastQuizAt;

    @PrePersist
    /** 신규 개념이 저장될 때 생성 시각을 설정한다. */
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Transient
    /** 전체 시도 중 정답을 맞힌 비율을 계산한다. */
    public double getAccuracy() {
        return attemptCount > 0 ? 1.0 - (double) incorrectCount / attemptCount : 0.0;
    }

    @Transient
    /** 전체 시도 중 오답 비율을 계산한다. */
    public double getIncorrectRate() {
        return attemptCount > 0 ? (double) incorrectCount / attemptCount : 0.0;
    }
}
