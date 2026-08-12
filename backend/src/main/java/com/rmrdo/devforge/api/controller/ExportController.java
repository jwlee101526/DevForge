package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.service.ExportService;
import com.rmrdo.devforge.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
/** 북마크 문제 및 학습 노트를 Markdown 및 PDF/HTML 파일로 내보내는 REST API */
public class ExportController {

    private final ExportService exportService;
    private final SecurityUtils securityUtils;

    @GetMapping("/markdown")
    public ResponseEntity<byte[]> exportMarkdown(
            @RequestParam(required = false) UUID groupId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        String markdown = exportService.exportToMarkdown(userId, groupId);

        byte[] content = markdown.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"DevForge_StudyNotes.md\"")
                .contentType(MediaType.parseMediaType("text/markdown; charset=UTF-8"))
                .body(content);
    }

    @GetMapping("/html")
    public ResponseEntity<String> exportHtml(
            @RequestParam(required = false) UUID groupId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        UUID userId = securityUtils.extractUserId(authHeader);
        String html = exportService.exportToPrintableHtml(userId, groupId);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }
}
