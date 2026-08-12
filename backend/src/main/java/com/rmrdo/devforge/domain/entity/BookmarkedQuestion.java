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
@Table(name = "bookmarked_questions", indexes = {
    @Index(name = "idx_bookmarked_question_user", columnList = "user_id"),
    @Index(name = "idx_bookmarked_question_group", columnList = "group_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/** 사용자가 책갈피에 추가한 individual 개별 퀴즈 문제 정보 엔티티 */
public class BookmarkedQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "group_id")
    private UUID groupId;

    @Column(length = 100, nullable = false)
    private String questionId;

    @Column(length = 50)
    private String questionType;

    @Column(length = 200)
    private String targetWord;

    @Column(length = 500)
    private String prompt;

    @Lob
    @Column(nullable = false)
    private String questionJson;

    @Lob
    private String answerKeyJson;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
