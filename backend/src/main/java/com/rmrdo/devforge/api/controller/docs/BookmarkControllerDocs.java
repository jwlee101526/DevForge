package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.domain.entity.BookmarkGroup;
import com.rmrdo.devforge.domain.entity.BookmarkedQuestion;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "북마크 API", description = "학습 문제 북마크 저장, 삭제 및 북마크 폴더(그룹) 관리")
public interface BookmarkControllerDocs {

    @Operation(summary = "북마크 그룹 목록 조회", description = "사용자가 생성한 북마크 폴더(그룹) 목록을 조회합니다.")
    ResponseEntity<List<Map<String, Object>>> getBookmarkGroups(String authHeader);

    @Operation(summary = "북마크 그룹 생성", description = "새로운 북마크 폴더(그룹)를 생성합니다.")
    ResponseEntity<BookmarkGroup> createBookmarkGroup(Map<String, String> payload, String authHeader);

    @Operation(summary = "북마크 그룹 삭제", description = "지정한 북마크 폴더(그룹)를 삭제합니다.")
    ResponseEntity<Map<String, Object>> deleteBookmarkGroup(UUID id, String authHeader);

    @Operation(summary = "북마크한 문제 목록 조회", description = "북마크된 문제들을 조회합니다. 그룹 ID를 지정하여 특정 폴더 내 문제만 조회할 수도 있습니다.")
    ResponseEntity<List<BookmarkedQuestion>> getBookmarkedQuestions(UUID groupId, String authHeader);

    @Operation(summary = "문제 북마크 추가", description = "특정 문제를 지정한 그룹 또는 기본 북마크에 추가합니다.")
    ResponseEntity<BookmarkedQuestion> addBookmark(Map<String, Object> payload, String authHeader);

    @Operation(summary = "북마크 해제", description = "북마크된 문제를 삭제(해제)합니다.")
    ResponseEntity<Map<String, Object>> removeBookmark(UUID id, String authHeader);
}
