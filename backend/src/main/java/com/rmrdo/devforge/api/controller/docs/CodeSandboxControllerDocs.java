package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.service.CodeSandboxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(name = "코드 샌드박스 API", description = "실시간 소스코드 컴파일, 실행 및 테스트케이스 검증")
public interface CodeSandboxControllerDocs {

    @Operation(summary = "코드 실행 및 검증", description = "제출된 소스코드를 격리된 환경에서 컴파일 및 실행하고 지정된 테스트케이스 결과와 비교합니다.")
    ResponseEntity<CodeSandboxService.SandboxResult> executeCode(Map<String, Object> payload);
}
