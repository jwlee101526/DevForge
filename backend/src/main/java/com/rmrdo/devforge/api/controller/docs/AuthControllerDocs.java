package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.dto.request.LoginRequest;
import com.rmrdo.devforge.application.dto.request.SignupRequest;
import com.rmrdo.devforge.application.dto.request.SocialLoginRequest;
import com.rmrdo.devforge.application.dto.response.AuthResponse;
import com.rmrdo.devforge.application.dto.response.UserDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Tag(name = "인증 API", description = "회원가입, 로그인, 소셜 로그인 및 사용자 프로필 관리")
public interface AuthControllerDocs {

    @Operation(summary = "일반 회원가입", description = "새로운 사용자 계정을 생성합니다.")
    ResponseEntity<AuthResponse> signup(SignupRequest request);

    @Operation(summary = "일반 로그인", description = "이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.")
    ResponseEntity<AuthResponse> login(LoginRequest request);

    @Operation(summary = "소셜 로그인", description = "GitHub, Google, Kakao 등의 소셜 계정 정보로 로그인합니다.")
    ResponseEntity<AuthResponse> socialLogin(SocialLoginRequest request);

    @Operation(summary = "소셜 로그인 제공자 목록 조회", description = "지원하는 소셜 로그인 프로바이더(GitHub, Google, Kakao) 정보를 조회합니다.")
    ResponseEntity<List<Map<String, String>>> getSocialProviders();

    @Operation(summary = "내 정보 조회", description = "Authorization 헤더의 JWT 토큰을 기반으로 현재 로그인한 사용자 정보를 조회합니다.")
    ResponseEntity<UserDto> me(String authHeader);
}
