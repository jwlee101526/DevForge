package com.rmrdo.devforge.infrastructure.ai;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CliProcessExecutorTest {

    @Test
    void executeFailsWhenProcessWritesOnlyStderr() {
        CliProcessExecutor executor = new CliProcessExecutor();
        ShellCommand command = stderrCommand("jetski: no output produced");

        assertThatThrownBy(() -> executor.execute(
                command.executable(),
                command.arguments(),
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
        ShellCommand command = stderrCommand("Usage of agy");

        executor.execute(
                command.executable(),
                command.arguments(),
                null,
                10,
                null,
                false
        );
    }

    private ShellCommand stderrCommand(String text) {
        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            return new ShellCommand("cmd.exe", List.of("/c", "echo " + text + " 1>&2"));
        }
        return new ShellCommand("sh", List.of("-c", "echo '" + text + "' >&2"));
    }

    private record ShellCommand(String executable, List<String> arguments) {
    }
}
