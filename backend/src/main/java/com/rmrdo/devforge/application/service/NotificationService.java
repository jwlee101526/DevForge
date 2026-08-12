package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.request.QuizGenerateRequest;
import com.rmrdo.devforge.application.dto.response.QuizGenerateResponse;
import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import com.rmrdo.devforge.infrastructure.persistence.DailyNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
/** 데일리 맞춤 알림 구독 및 취약점 기반 자동 알림 퀴즈 생성 서비스 */
public class NotificationService {

    private final DailyNotificationRepository notificationRepository;
    private final QuizService quizService;
    private final WeaknessService weaknessService;

    @Transactional
    public DailyNotificationSubscription subscribe(UUID userId, String email, String pushEndpoint, String preferredTime) {
        final UUID targetUserId = (userId != null) ? userId : UUID.fromString("00000000-0000-0000-0000-000000000000");

        DailyNotificationSubscription sub = notificationRepository.findByUserId(targetUserId)
                .orElseGet(() -> DailyNotificationSubscription.builder().userId(targetUserId).build());

        sub.setEmail(email);
        sub.setPushEndpoint(pushEndpoint);
        sub.setPreferredTime(preferredTime != null ? preferredTime : "09:00");
        sub.setActive(true);

        return notificationRepository.save(sub);
    }

    @Transactional(readOnly = true)
    public DailyNotificationSubscription getSubscription(UUID userId) {
        if (userId == null) return null;
        return notificationRepository.findByUserId(userId).orElse(null);
    }

    @Transactional
    public Map<String, Object> triggerDailyQuizNotification(UUID userId) {
        if (userId == null) userId = UUID.fromString("00000000-0000-0000-0000-000000000000");

        // 취약점 태그 추출
        var weaknessAnalytics = weaknessService.getWeaknessAnalytics(userId);
        List<String> weakTags = weaknessAnalytics.recommendedReviewKeywords() != null ? weaknessAnalytics.recommendedReviewKeywords() : List.of("Java", "Spring");

        QuizGenerateRequest request = new QuizGenerateRequest(
                "random",
                "daily",
                true,
                weakTags,
                false,
                false,
                null,
                null,
                "데일리 복습 퀴즈 3문항",
                3,
                Map.of("meaning_choice", 3),
                weakTags,
                "medium"
        );

        QuizGenerateResponse quiz = quizService.generateQuiz(request, userId);
        log.info("Triggered daily notification quiz with sessionId: {}", quiz.answerToken());

        return Map.of(
                "success", true,
                "title", "🔔 오늘의 데일리 복습 퀴즈 3문항이 도착했습니다!",
                "sessionId", quiz.answerToken() != null ? quiz.answerToken() : "",
                "weaknessTags", weakTags,
                "questionCount", quiz.questions() != null ? quiz.questions().size() : 0
        );
    }
}
