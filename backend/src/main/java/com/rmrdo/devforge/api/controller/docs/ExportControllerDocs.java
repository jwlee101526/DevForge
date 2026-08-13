package com.rmrdo.devforge.api.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(name = "학습 노트 내보내기 API", description = "북마크된 학습 오답 노트 및 문제를 Markdown, HTML, PDF 파일로 내보내기")
public interface ExportControllerDocs {

    @Operation(summary = "Markdown 내보내기", description = "북마크된 문제를 Markdown 문서 파일(.md)로 내보냅니다.")
    ResponseEntity<byte[]> exportMarkdown(UUID groupId, boolean includeAnswers, String authHeader);

    @Operation(summary = "인쇄용 HTML 내보내기", description = "북마크된 문제를 인쇄/프린트용 HTML 문서로 생성하여 반환합니다.")
    ResponseEntity<String> exportHtml(UUID groupId, boolean includeAnswers, String authHeader);

    @Operation(summary = "PDF 문서 내보내기", description = "북마크된 문제를 PDF 문서 파일(.pdf)로 내보냅니다.")
    ResponseEntity<byte[]> exportPdf(UUID groupId, boolean includeAnswers, String authHeader);
}
