package com.rmrdo.devforge.api.controller.docs;

import com.rmrdo.devforge.application.service.CodeSandboxService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Tag(
    name = "Code Sandbox API",
    description = """
        격리된 멀티언어 샌드박스 환경에서 소스코드를 컴파일 및 실행하고 검증하는 API입니다.
        
        ### 주요 특징
        - **지원 언어**: Java, Python, JavaScript, C++
        - **실행 제한**: 샌드박스 타임아웃 5초, 메모리 제한 적용
        - **결과 반환**: 컴파일 에러, 표준 출력(stdout), 실행 시간 및 테스트케이스 통과 여부 제공
        """
)
public interface CodeSandboxControllerDocs {

    @Operation(summary = "Execute Code and Verify", description = "제출된 소스코드를 격리된 환경에서 컴파일 및 실행하고 지정된 테스트케이스 결과와 비교합니다.")
    ResponseEntity<CodeSandboxService.SandboxResult> executeCode(Map<String, Object> payload);
}
