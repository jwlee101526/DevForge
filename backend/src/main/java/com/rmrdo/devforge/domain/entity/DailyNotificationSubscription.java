package com.rmrdo.devforge.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "daily_notification_subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
/** 일일 맞춤 데일리 퀴즈 및 학습 알림 구독 정보를 저장한다. */
public class DailyNotificationSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(length = 200)
    private String email;

    @Column(length = 500)
    private String pushEndpoint;

    @Column(length = 20)
    private String preferredTime; // "09:00", "20:00"

    private boolean active;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
