package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.domain.entity.BookmarkGroup;
import com.rmrdo.devforge.domain.entity.BookmarkedQuestion;
import com.rmrdo.devforge.infrastructure.persistence.BookmarkGroupRepository;
import com.rmrdo.devforge.infrastructure.persistence.BookmarkedQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
/** 선호하는 문제 책갈피(북마크) 및 그룹/폴더 관리를 처리하는 애플리케이션 서비스 */
public class BookmarkService {

    private final BookmarkGroupRepository groupRepository;
    private final BookmarkedQuestionRepository questionRepository;

    @Transactional(readOnly = true)
    /** 사용자별 책갈피 그룹 목록과 그룹별 저장된 문제 수를 함께 반환한다. */
    public List<Map<String, Object>> getBookmarkGroups(UUID userId) {
        if (userId == null) return List.of();

        List<BookmarkGroup> groups = groupRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<BookmarkedQuestion> allBookmarks = questionRepository.findByUserIdOrderByCreatedAtDesc(userId);

        Map<UUID, Integer> counts = new HashMap<>();
        for (BookmarkedQuestion b : allBookmarks) {
            if (b.getGroupId() != null) {
                counts.put(b.getGroupId(), counts.getOrDefault(b.getGroupId(), 0) + 1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (BookmarkGroup g : groups) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId().toString());
            map.put("name", g.getName());
            map.put("description", g.getDescription());
            map.put("color", g.getColor());
            map.put("count", counts.getOrDefault(g.getId(), 0));
            map.put("createdAt", g.getCreatedAt());
            result.add(map);
        }
        return result;
    }

    @Transactional
    /** 신규 책갈피 그룹/폴더를 생성한다. */
    public BookmarkGroup createGroup(UUID userId, String name, String description, String color) {
        if (userId == null || name == null || name.isBlank()) {
            throw new IllegalArgumentException("사용자 ID와 그룹명은 필수입니다.");
        }
        BookmarkGroup group = BookmarkGroup.builder()
                .userId(userId)
                .name(name.trim())
                .description(description != null ? description.trim() : "")
                .color(color != null ? color : "indigo")
                .build();
        return groupRepository.save(group);
    }

    @Transactional
    /** 지정된 책갈피 그룹/폴더를 삭제한다. */
    public boolean deleteGroup(UUID userId, UUID groupId) {
        if (userId == null || groupId == null) return false;
        Optional<BookmarkGroup> group = groupRepository.findById(groupId);
        if (group.isPresent() && group.get().getUserId().equals(userId)) {
            groupRepository.delete(group.get());
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    /** 사용자 본인의 책갈피 문제 목록을 조회한다. 특정 groupId 지정 시 해당 그룹 목록만 반환한다. */
    public List<BookmarkedQuestion> getBookmarkedQuestions(UUID userId, UUID groupId) {
        if (userId == null) return List.of();
        if (groupId != null) {
            return questionRepository.findByUserIdAndGroupIdOrderByCreatedAtDesc(userId, groupId);
        }
        return questionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    /** 개별 문제를 책갈피에 저장 또는 업데이트한다. */
    public BookmarkedQuestion addBookmark(
            UUID userId,
            UUID groupId,
            String questionId,
            String questionType,
            String targetWord,
            String prompt,
            String questionJson,
            String answerKeyJson) {
        if (userId == null || questionId == null || questionJson == null) {
            throw new IllegalArgumentException("필수 값이 누락되었습니다.");
        }

        Optional<BookmarkedQuestion> existing = questionRepository.findByUserIdAndQuestionId(userId, questionId);
        BookmarkedQuestion bookmark;
        if (existing.isPresent()) {
            bookmark = existing.get();
            if (groupId != null) bookmark.setGroupId(groupId);
        } else {
            bookmark = BookmarkedQuestion.builder()
                    .userId(userId)
                    .groupId(groupId)
                    .questionId(questionId)
                    .questionType(questionType)
                    .targetWord(targetWord)
                    .prompt(prompt)
                    .questionJson(questionJson)
                    .answerKeyJson(answerKeyJson)
                    .build();
        }
        return questionRepository.save(bookmark);
    }

    @Transactional
    /** 지정된 책갈피 문제를 해제/삭제한다. */
    public boolean removeBookmark(UUID userId, UUID bookmarkId) {
        if (userId == null || bookmarkId == null) return false;
        Optional<BookmarkedQuestion> bookmark = questionRepository.findById(bookmarkId);
        if (bookmark.isPresent() && bookmark.get().getUserId().equals(userId)) {
            questionRepository.delete(bookmark.get());
            return true;
        }
        return false;
    }
}
