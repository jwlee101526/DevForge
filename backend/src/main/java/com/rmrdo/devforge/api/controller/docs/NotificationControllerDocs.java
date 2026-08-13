package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(name = "알림 API", description = "매일 정해진 시간에 제공되는 데일리 복습 푸시/이메일 알림 설정")
public interface NotificationControllerDocs {

    @Operation(summary = "알림 구독 등록/수정", description = "사용자의 데일리 퀴즈 푸시 및 이메일 알림 시간/서브스크립션을 등록하거나 변경합니다.")
    ResponseEntity<Map<String, Object>> subscribe(Map<String, Object> payload, String authHeader);

    @Operation(summary = "알림 구독 현황 조회", description = "현재 사용자의 데일리 알림 설정 정보를 조회합니다.")
    ResponseEntity<DailyNotificationSubscription> getSubscription(String authHeader);

    @Operation(summary = "데일리 알림 수동 발송 테스트", description = "테스트용으로 데일리 복습 퀴즈 알림을 즉시 트리거합니다.")
    ResponseEntity<Map<String, Object>> triggerDaily(String authHeader);
}
