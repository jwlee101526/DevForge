package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.api.controller.docs.NotificationControllerDocs;
import com.rmrdo.devforge.application.service.NotificationService;
import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import com.rmrdo.devforge.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController implements NotificationControllerDocs {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        String email = (String) payload.get("email");
        String pushEndpoint = (String) payload.get("endpoint");
        if (pushEndpoint == null) pushEndpoint = (String) payload.get("pushEndpoint");
        String preferredTime = (String) payload.get("preferredTime");

        DailyNotificationSubscription sub = notificationService.subscribe(userId, email, pushEndpoint, preferredTime);
        return ResponseEntity.ok(Map.of(
                "subscribed", true,
                "subscriptionId", sub.getId(),
                "preferredTime", sub.getPreferredTime() != null ? sub.getPreferredTime() : "09:00"
        ));
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
