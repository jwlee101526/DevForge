package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(
    name = "Notification API",
    description = """
        매일 지정된 시간에 발송되는 데일리 복습 퀴즈 푸시 및 이메일 알림 설정 API입니다.
        
        ### 주요 기능
        - **알림 설정**: 데일리 알림 수신 시간 및 수신 채널(이메일/푸시) 변경
        - **수동 트리거**: 데일리 복습 알림 즉시 발송 테스트
        
        ### 보안 요구사항
        - `Authorization: Bearer <JWT_TOKEN>` 헤더 필수
        """
)
public interface NotificationControllerDocs {

    @Operation(summary = "Subscribe or Update Daily Notification", description = "사용자의 데일리 퀴즈 푸시 및 이메일 알림 시간/서브스크립션을 등록하거나 변경합니다.")
    ResponseEntity<Map<String, Object>> subscribe(Map<String, Object> payload, String authHeader);

    @Operation(summary = "Get Notification Subscription Status", description = "현재 사용자의 데일리 알림 설정 정보를 조회합니다.")
    ResponseEntity<DailyNotificationSubscription> getSubscription(String authHeader);

    @Operation(summary = "Trigger Daily Notification Manually", description = "테스트용으로 데일리 복습 퀴즈 알림을 즉시 트리거합니다.")
    ResponseEntity<Map<String, Object>> triggerDaily(String authHeader);
}
