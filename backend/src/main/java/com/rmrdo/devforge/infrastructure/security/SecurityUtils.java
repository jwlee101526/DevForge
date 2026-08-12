package com.rmrdo.devforge.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
/** Authorization 헤더에서 JWT 토큰을 검증하고 사용자 UUID를 안전하게 추출하는 공통 보안 유틸리티 */
public class SecurityUtils {

    public static final UUID GUEST_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000000");

    private final JwtTokenProvider tokenProvider;

    /** Authorization 헤더(Bearer token)에서 사용자 ID를 추출한다. 미인증/무효 시 GUEST_USER_ID를 반환한다. */
    public UUID extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return GUEST_USER_ID;
        }
        String token = authHeader.substring(7);
        UUID userId = tokenProvider.getUserIdFromToken(token);
        return userId != null ? userId : GUEST_USER_ID;
    }

    /** 엄격한 인증이 필요한 엔드포인트용으로 미인증 시 null을 반환한다. */
    public UUID extractUserIdStrict(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        String token = authHeader.substring(7);
        return tokenProvider.getUserIdFromToken(token);
    }
}
