package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.request.SocialLoginRequest;
import com.rmrdo.devforge.application.dto.response.AuthResponse;
import com.rmrdo.devforge.domain.entity.User;
import com.rmrdo.devforge.infrastructure.persistence.UserRepository;
import com.rmrdo.devforge.infrastructure.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Test
    @DisplayName("소셜 로그인 - 신규 사용자가 소셜 로그인 시 새 User 엔티티 생성 및 토큰 발급")
    void socialLoginNewUserCreatesAccountAndToken() {
        UserRepository userRepository = mock(UserRepository.class);
        JwtTokenProvider tokenProvider = mock(JwtTokenProvider.class);
        AuthService authService = new AuthService(userRepository, tokenProvider);

        SocialLoginRequest request = new SocialLoginRequest("GITHUB", "code-123", "http://localhost/callback", "test@github.com", "GitHub User", "gh-999");

        when(userRepository.findByProviderAndProviderId("GITHUB", "gh-999")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("test@github.com")).thenReturn(Optional.empty());

        UUID generatedId = UUID.randomUUID();
        User savedUser = User.builder()
                .id(generatedId)
                .email("test@github.com")
                .name("GitHub User")
                .provider("GITHUB")
                .providerId("gh-999")
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.createToken(generatedId, "test@github.com")).thenReturn("mock-jwt-token");

        AuthResponse response = authService.socialLogin(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.token());
        assertEquals("GITHUB", response.user().provider());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
