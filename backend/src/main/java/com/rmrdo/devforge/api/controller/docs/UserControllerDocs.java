package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.dto.response.UserRankDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "사용자 API", description = "사용자 정보, 등급(Tier) 및 XP/랭킹 조회 관리")
public interface UserControllerDocs {

    @Operation(summary = "내 등급 및 XP 정보 조회", description = "현재 로그인한 사용자의 등급(Tier), XP 및 랭킹 정보를 조회합니다.")
    ResponseEntity<UserRankDto> getMyGrade(String authHeader);
}
