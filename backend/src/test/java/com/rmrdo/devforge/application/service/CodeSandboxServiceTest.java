package com.rmrdo.devforge.application.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CodeSandboxServiceTest {

    @Test
    @DisplayName("002. Code Sandbox Execution - Java 코드 컴파일 및 테스트 케이스 평가")
    void testCodeSandboxExecutionJava() {
        CodeSandboxService sandboxService = new CodeSandboxService();

        String javaCode = "public class Solution { public static void main(String[] args) { System.out.println(\"Hello DevForge\"); } }";
        List<CodeSandboxService.TestCase> testCases = List.of(
                new CodeSandboxService.TestCase("1", "Hello DevForge")
        );

        CodeSandboxService.SandboxResult result = sandboxService.execute("JAVA", javaCode, testCases);

        assertTrue(result.success());
        assertEquals(1, result.testResults().size());
        assertTrue(result.testResults().get(0).passed());
        assertEquals("Hello DevForge", result.testResults().get(0).actualOutput());
        assertTrue(result.memoryUsedBytes() >= 0);
    }
}
