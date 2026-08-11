package com.rmrdo.devforge.infrastructure.ai;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CliProcessExecutorTest {

    @Test
    void executeFailsWhenProcessWritesOnlyStderr() {
        CliProcessExecutor executor = new CliProcessExecutor();

        assertThatThrownBy(() -> executor.execute(
                "cmd.exe",
                List.of("/c", "echo jetski: no output produced 1>&2"),
                null,
                10
        ))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("AI CLI가 응답을 생성하지 못했습니다")
                .hasMessageContaining("jetski: no output produced");
    }

    @Test
    void executeAllowsOnlyStderrWhenStdoutIsNotRequired() {
        CliProcessExecutor executor = new CliProcessExecutor();

        executor.execute(
                "cmd.exe",
                List.of("/c", "echo Usage of agy 1>&2"),
                null,
                10,
                null,
                false
        );
    }
}
