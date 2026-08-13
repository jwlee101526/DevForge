package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.dto.response.UserRankDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(
    name = "User API",
    description = """
        사용자의 프로필, 등급(Tier), 경험치(XP) 및 학습 랭킹 정보 관리 API입니다.
        
        ### 제공 정보
        - 현재 등급 (Bronze, Silver, Gold, Platinum 등)
        - 누적 XP 및 정답률 기반 전체 사용자 순위
        """
)
public interface UserControllerDocs {

    @Operation(summary = "Get Grade and XP Info", description = "현재 로그인한 사용자의 등급(Tier), XP 및 랭킹 정보를 조회합니다.")
    ResponseEntity<UserRankDto> getMyGrade(String authHeader);
}
