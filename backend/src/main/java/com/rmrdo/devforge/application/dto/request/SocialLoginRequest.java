package com.rmrdo.devforge.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SocialLoginRequest(
        @NotBlank String provider, // "GITHUB", "GOOGLE", "KAKAO"
        String code,
        String redirectUri,
        String email,
        String name,
        String providerId
) {}
