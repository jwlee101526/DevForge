package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.domain.entity.BookmarkedQuestion;
import com.rmrdo.devforge.infrastructure.persistence.BookmarkGroupRepository;
import com.rmrdo.devforge.infrastructure.persistence.BookmarkedQuestionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ExportServiceTest {

    @Test
    @DisplayName("003. Markdown 내보내기 - includeAnswers 옵션에 따른 정답 및 해설 포함 검증")
    void testExportToMarkdownWithIncludeAnswers() {
        BookmarkedQuestionRepository bookmarkRepo = mock(BookmarkedQuestionRepository.class);
        BookmarkGroupRepository groupRepo = mock(BookmarkGroupRepository.class);
        ExportService exportService = new ExportService(bookmarkRepo, groupRepo);

        UUID userId = UUID.randomUUID();
        BookmarkedQuestion bq = BookmarkedQuestion.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .targetWord("Spring Security")
                .questionType("meaning_choice")
                .prompt("Spring Security 필터 체인 동작 방식")
                .answerKeyJson("{\"answer\":\"DelegatingFilterProxy\"}")
                .build();

        when(bookmarkRepo.findByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of(bq));

        String mdWithAnswers = exportService.exportToMarkdown(userId, null, true);
        assertTrue(mdWithAnswers.contains("Spring Security"));
        assertTrue(mdWithAnswers.contains("💡 정답 및 해설 보기"));

        String mdNoAnswers = exportService.exportToMarkdown(userId, null, false);
        assertTrue(mdNoAnswers.contains("Spring Security"));
        assertFalse(mdNoAnswers.contains("💡 정답 및 해설 보기"));
    }
}
