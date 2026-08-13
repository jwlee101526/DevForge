package com.rmrdo.devforge.api.controller.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@Tag(
    name = "Export API",
    description = """
        북마크된 오답 노트 및 문제들을 다양한 파일 포맷으로 내보내는 API입니다.
        
        ### 지원 포맷
        - **Markdown (.md)**: 문서화 및 로컬 백업용 포맷
        - **HTML**: 프린트/인쇄 전용 웹 문서 포맷
        - **PDF (.pdf)**: 다운로드 및 인쇄용 포맷
        
        ### 옵션
        - `includeAnswers`: 정답 및 해설 포함 여부를 선택할 수 있습니다.
        """
)
public interface ExportControllerDocs {

    @Operation(summary = "Export Markdown", description = "북마크된 문제를 Markdown 문서 파일(.md)로 내보냅니다.")
    ResponseEntity<byte[]> exportMarkdown(UUID groupId, boolean includeAnswers, String authHeader);

    @Operation(summary = "Export HTML", description = "북마크된 문제를 인쇄/프린트용 HTML 문서로 생성하여 반환합니다.")
    ResponseEntity<String> exportHtml(UUID groupId, boolean includeAnswers, String authHeader);

    @Operation(summary = "Export PDF", description = "북마크된 문제를 PDF 문서 파일(.pdf)로 내보냅니다.")
    ResponseEntity<byte[]> exportPdf(UUID groupId, boolean includeAnswers, String authHeader);
}
