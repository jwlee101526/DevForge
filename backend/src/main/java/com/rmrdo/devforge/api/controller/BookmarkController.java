package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.api.controller.docs.BookmarkControllerDocs;
import com.rmrdo.devforge.application.service.BookmarkService;
import com.rmrdo.devforge.domain.entity.BookmarkGroup;
import com.rmrdo.devforge.domain.entity.BookmarkedQuestion;
import com.rmrdo.devforge.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookmarks")
@RequiredArgsConstructor
public class BookmarkController implements BookmarkControllerDocs {

    private final BookmarkService bookmarkService;
    private final SecurityUtils securityUtils;

    @GetMapping("/groups")
    public ResponseEntity<List<Map<String, Object>>> getBookmarkGroups(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        return ResponseEntity.ok(bookmarkService.getBookmarkGroups(userId));
    }

    @PostMapping("/groups")
    public ResponseEntity<BookmarkGroup> createBookmarkGroup(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        String name = payload.get("name");
        String description = payload.get("description");
        String color = payload.get("color");
        return ResponseEntity.ok(bookmarkService.createGroup(userId, name, description, color));
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Map<String, Object>> deleteBookmarkGroup(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        boolean success = bookmarkService.deleteGroup(userId, id);
        return ResponseEntity.ok(Map.of("success", success));
    }

    @GetMapping
    public ResponseEntity<List<BookmarkedQuestion>> getBookmarkedQuestions(
            @RequestParam(required = false) UUID groupId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        return ResponseEntity.ok(bookmarkService.getBookmarkedQuestions(userId, groupId));
    }

    @PostMapping
    public ResponseEntity<BookmarkedQuestion> addBookmark(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        UUID groupId = payload.get("groupId") != null ? UUID.fromString(payload.get("groupId").toString()) : null;
        String questionId = (String) payload.get("questionId");
        String questionType = (String) payload.get("questionType");
        String targetWord = (String) payload.get("targetWord");
        String prompt = (String) payload.get("prompt");
        String questionJson = (String) payload.get("questionJson");
        String answerKeyJson = (String) payload.get("answerKeyJson");

        BookmarkedQuestion result = bookmarkService.addBookmark(
                userId, groupId, questionId, questionType, targetWord, prompt, questionJson, answerKeyJson);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> removeBookmark(
            @PathVariable UUID id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        boolean success = bookmarkService.removeBookmark(userId, id);
        return ResponseEntity.ok(Map.of("success", success));
    }
}
