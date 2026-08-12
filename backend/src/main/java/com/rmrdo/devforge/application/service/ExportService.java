package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.domain.entity.BookmarkGroup;
import com.rmrdo.devforge.domain.entity.BookmarkedQuestion;
import com.rmrdo.devforge.infrastructure.persistence.BookmarkGroupRepository;
import com.rmrdo.devforge.infrastructure.persistence.BookmarkedQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
/** 북마크된 퀴즈 및 오답 노트를 마크다운(Markdown) 및 인쇄/PDF용 HTML로 내보내는 서비스 */
public class ExportService {

    private final BookmarkedQuestionRepository bookmarkRepository;
    private final BookmarkGroupRepository groupRepository;

    @Transactional(readOnly = true)
    public String exportToMarkdown(UUID userId, UUID groupId) {
        List<BookmarkedQuestion> bookmarks;
        String groupName = "전체 오답 및 필수 문제집";

        if (groupId != null) {
            BookmarkGroup group = groupRepository.findById(groupId).orElse(null);
            if (group != null) groupName = group.getName();
            bookmarks = bookmarkRepository.findByUserIdAndGroupIdOrderByCreatedAtDesc(userId, groupId);
        } else if (userId != null) {
            bookmarks = bookmarkRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            bookmarks = bookmarkRepository.findAll();
        }

        StringBuilder sb = new StringBuilder();
        sb.append("# 📘 DevForge - ").append(groupName).append("\n\n");
        sb.append("> 생성 일시: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))).append("\n");
        sb.append("> 총 문제 수: ").append(bookmarks.size()).append("개\n\n");
        sb.append("---\n\n");

        int index = 1;
        for (BookmarkedQuestion q : bookmarks) {
            sb.append("### Q").append(index++).append(". ").append(q.getTargetWord() != null ? q.getTargetWord() : "개발 개념 문제").append("\n");
            sb.append("**유형**: `").append(q.getQuestionType() != null ? q.getQuestionType() : "일반").append("`  \n");
            sb.append("**문제 설명**:\n").append(q.getPrompt() != null ? q.getPrompt() : "").append("\n\n");

            if (q.getQuestionJson() != null && !q.getQuestionJson().isBlank()) {
                sb.append("```json\n").append(q.getQuestionJson()).append("\n```\n\n");
            }
            if (q.getAnswerKeyJson() != null && !q.getAnswerKeyJson().isBlank()) {
                sb.append("<details>\n<summary><b>💡 정답 및 해설 보기</b></summary>\n\n");
                sb.append("```json\n").append(q.getAnswerKeyJson()).append("\n```\n</details>\n\n");
            }
            sb.append("---\n\n");
        }

        return sb.toString();
    }

    @Transactional(readOnly = true)
    public String exportToPrintableHtml(UUID userId, UUID groupId) {
        String markdown = exportToMarkdown(userId, groupId);
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>DevForge Study Notes</title>");
        html.append("<style>");
        html.append("body { font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }");
        html.append("h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }");
        html.append("h3 { color: #0f172a; margin-top: 24px; }");
        html.append("code, pre { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-family: monospace; }");
        html.append("pre { padding: 12px; overflow-x: auto; }");
        html.append("blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 12px; color: #64748b; }");
        html.append("@media print { body { max-width: 100%; margin: 0; } }");
        html.append("</style></head><body>");
        html.append("<div class='content'>").append(markdown.replace("\n", "<br/>")).append("</div>");
        html.append("</body></html>");
        return html.toString();
    }
}
