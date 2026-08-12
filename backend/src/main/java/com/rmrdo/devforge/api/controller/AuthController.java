package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.dto.request.LoginRequest;
import com.rmrdo.devforge.application.dto.request.SignupRequest;
import com.rmrdo.devforge.application.dto.response.AuthResponse;
import com.rmrdo.devforge.application.dto.response.UserDto;
import com.rmrdo.devforge.application.service.AuthService;
import com.rmrdo.devforge.infrastructure.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/social/login")
    public ResponseEntity<AuthResponse> socialLogin(@Valid @RequestBody com.rmrdo.devforge.application.dto.request.SocialLoginRequest request) {
        return ResponseEntity.ok(authService.socialLogin(request));
    }

    @GetMapping("/social/providers")
    public ResponseEntity<java.util.List<java.util.Map<String, String>>> getSocialProviders() {
        return ResponseEntity.ok(java.util.List.of(
                java.util.Map.of("id", "GITHUB", "name", "GitHub", "color", "#24292e", "icon", "github"),
                java.util.Map.of("id", "GOOGLE", "name", "Google", "color", "#4285F4", "icon", "google"),
                java.util.Map.of("id", "KAKAO", "name", "KakaoTalk", "color", "#FEE500", "icon", "kakao")
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }
        String token = authHeader.substring(7);
        UUID userId = tokenProvider.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        UserDto user = authService.getCurrentUser(userId);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(user);
    }
}
