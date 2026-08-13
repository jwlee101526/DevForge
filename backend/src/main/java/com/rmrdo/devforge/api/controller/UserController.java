package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.api.controller.docs.UserControllerDocs;
import com.rmrdo.devforge.application.dto.response.UserRankDto;
import com.rmrdo.devforge.application.service.UserGradeService;
import com.rmrdo.devforge.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * 사용자 정보 및 등급(Tier) 관리를 제공하는 REST 컨트롤러.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController implements UserControllerDocs {

    private final UserGradeService userGradeService;
    private final SecurityUtils securityUtils;

    /**
     * 현재 로그인한 사용자의 등급 및 XP 정보를 조회한다.
     *
     * @param authHeader Authorization 헤더 (JWT 토큰)
     * @return 사용자 등급 응답 (UserRankDto)
     */
    @Override
    @GetMapping("/me/grade")
    public ResponseEntity<UserRankDto> getMyGrade(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserIdStrict(authHeader);
        return ResponseEntity.ok(userGradeService.getUserGrade(userId));
    }
}
