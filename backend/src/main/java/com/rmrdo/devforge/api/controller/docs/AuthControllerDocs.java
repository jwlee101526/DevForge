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

@Tag(
    name = "Auth API",
    description = """
        사용자 계정 생성, 로그인, 소셜 OAuth2 인증 및 내 프로필 관리를 담당하는 API입니다.
        
        ### 주요 기능
        - **일반 인증**: 이메일/비밀번호 기반 회원가입 및 JWT 토큰 발급
        - **소셜 인증**: GitHub, Google, Kakao 등 외부 프로바이더 연동
        
        ### 보안 요구사항
        - **공개 엔드포인트**: 회원가입, 로그인, 소셜 로그인, 프로바이더 목록
        - **인증 엔드포인트**: `GET /api/v1/auth/me` (헤더: `Authorization: Bearer <JWT_TOKEN>`)
        """
)
public interface AuthControllerDocs {

    @Operation(summary = "User Signup", description = "새로운 사용자 계정을 생성합니다.")
    ResponseEntity<AuthResponse> signup(SignupRequest request);

    @Operation(summary = "User Login", description = "이메일과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다.")
    ResponseEntity<AuthResponse> login(LoginRequest request);

    @Operation(summary = "Social Login", description = "GitHub, Google, Kakao 등의 소셜 계정 정보로 로그인합니다.")
    ResponseEntity<AuthResponse> socialLogin(SocialLoginRequest request);

    @Operation(summary = "Social Signup", description = "GitHub, Google, Kakao 등의 소셜 계정 정보로 신규 계정을 생성하거나 기존 계정에 연결합니다.")
    ResponseEntity<AuthResponse> socialSignup(SocialLoginRequest request);

    @Operation(summary = "Get Social Providers", description = "지원하는 소셜 로그인 프로바이더(GitHub, Google, Kakao) 정보를 조회합니다.")
    ResponseEntity<List<Map<String, String>>> getSocialProviders();

    @Operation(summary = "Get Current User Profile", description = "Authorization 헤더의 JWT 토큰을 기반으로 현재 로그인한 사용자 정보를 조회합니다.")
    ResponseEntity<UserDto> me(String authHeader);
}
