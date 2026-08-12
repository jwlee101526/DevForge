package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import com.rmrdo.devforge.infrastructure.persistence.DailyNotificationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NotificationServiceTest {

    @Test
    @DisplayName("005. Notification Subscription - 데일리 푸시 및 VAPID 키 알림 구독 저장")
    void testSubscribeDailyNotification() {
        DailyNotificationRepository repository = mock(DailyNotificationRepository.class);
        WeaknessService weaknessService = mock(WeaknessService.class);
        QuizService quizService = mock(QuizService.class);
        NotificationService notificationService = new NotificationService(repository, quizService, weaknessService);

        UUID userId = UUID.randomUUID();
        when(repository.findByUserId(userId)).thenReturn(Optional.empty());
        when(repository.save(any(DailyNotificationSubscription.class))).thenAnswer(i -> i.getArgument(0));

        DailyNotificationSubscription sub = notificationService.subscribe(userId, "user@test.com", "https://fcm.googleapis.com/fcm/send/token123", "09:00");

        assertNotNull(sub);
        assertEquals("user@test.com", sub.getEmail());
        assertEquals("https://fcm.googleapis.com/fcm/send/token123", sub.getPushEndpoint());
        assertEquals("09:00", sub.getPreferredTime());
        assertTrue(sub.isActive());
    }
}
