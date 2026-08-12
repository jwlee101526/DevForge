package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.service.NotificationService;
import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import com.rmrdo.devforge.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
/** 데일리 복습 푸시 알림 설정 및 트리거 REST API */
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    @PostMapping("/subscribe")
    public ResponseEntity<DailyNotificationSubscription> subscribe(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        String email = payload.get("email");
        String pushEndpoint = payload.get("pushEndpoint");
        String preferredTime = payload.get("preferredTime");

        DailyNotificationSubscription sub = notificationService.subscribe(userId, email, pushEndpoint, preferredTime);
        return ResponseEntity.ok(sub);
    }

    @GetMapping("/subscription")
    public ResponseEntity<DailyNotificationSubscription> getSubscription(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        DailyNotificationSubscription sub = notificationService.getSubscription(userId);
        if (sub == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(sub);
    }

    @PostMapping("/trigger-daily")
    public ResponseEntity<Map<String, Object>> triggerDaily(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        return ResponseEntity.ok(notificationService.triggerDailyQuizNotification(userId));
    }
}
