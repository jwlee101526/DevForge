package com.rmrdo.devforge.infrastructure.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class CliProcessExecutor {

    public String execute(String executable, String arguments, String stdinInput, int timeoutSeconds) {
        log.info("Executing CLI: {} {}", executable, arguments);

        ProcessBuilder pb;
        if (System.getProperty("os.name").toLowerCase().contains("win")) {
            pb = new ProcessBuilder("cmd.exe", "/c", executable + " " + arguments);
        } else {
            pb = new ProcessBuilder("sh", "-c", executable + " " + arguments);
        }

        try {
            Process process = pb.start();

            if (stdinInput != null && !stdinInput.isEmpty()) {
                try (Writer writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
                    writer.write(stdinInput);
                    writer.flush();
                }
            }

            StringBuilder stdout = new StringBuilder();
            StringBuilder stderr = new StringBuilder();

            Thread outThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stdout.append(line).append("\n");
                    }
                } catch (Exception e) {
                    log.error("Error reading stdout", e);
                }
            });

            Thread errThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stderr.append(line).append("\n");
                    }
                } catch (Exception e) {
                    log.error("Error reading stderr", e);
                }
            });

            outThread.start();
            errThread.start();

            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);

            outThread.join(1000);
            errThread.join(1000);

            if (!finished) {
                process.destroyForcibly();
                throw new RuntimeException("CLI process timed out after " + timeoutSeconds + "s: " + executable);
            }

            int exitCode = process.exitValue();
            String output = stdout.toString().trim();
            String error = stderr.toString().trim();

            if (exitCode != 0) {
                log.error("CLI process failed with exit code {}. Stderr: {}", exitCode, error);
                throw new RuntimeException("CLI process exited with code " + exitCode + ": " + error);
            }

            if (!error.isEmpty()) {
                log.warn("CLI stderr (non-fatal): {}", error);
            }

            if (output.isEmpty() && !error.isEmpty()) {
                throw new RuntimeException("AI CLI가 응답을 생성하지 못했습니다: " + preview(error));
            }

            log.debug("CLI output length: {} chars", output.length());
            return output;

        } catch (Exception e) {
            if (e instanceof RuntimeException) {
                throw (RuntimeException) e;
            }
            throw new RuntimeException("Failed to execute CLI process", e);
        }
    }

    public String execute(String executable, List<String> arguments, String stdinInput, int timeoutSeconds) {
        return execute(executable, arguments, stdinInput, timeoutSeconds, null);
    }

    public String execute(String executable, List<String> arguments, String stdinInput, int timeoutSeconds, Map<String, String> environment) {
        return execute(executable, arguments, stdinInput, timeoutSeconds, environment, true);
    }

    public String execute(String executable, List<String> arguments, String stdinInput, int timeoutSeconds, Map<String, String> environment, boolean requireStdout) {
        List<String> command = new ArrayList<>();
        command.add(executable);
        command.addAll(arguments);
        log.info("Executing CLI: {}", command);

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            if (environment != null) {
                environment.forEach((key, value) -> {
                    if (key != null && !key.isBlank() && value != null && !value.isBlank()) {
                        processBuilder.environment().put(key, value);
                    }
                });
            }
            Process process = processBuilder.start();

            if (stdinInput != null && !stdinInput.isEmpty()) {
                try (Writer writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
                    writer.write(stdinInput);
                    writer.flush();
                }
            }

            StringBuilder stdout = new StringBuilder();
            StringBuilder stderr = new StringBuilder();

            Thread outThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stdout.append(line).append("\n");
                    }
                } catch (Exception e) {
                    log.error("Error reading stdout", e);
                }
            });

            Thread errThread = new Thread(() -> {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stderr.append(line).append("\n");
                    }
                } catch (Exception e) {
                    log.error("Error reading stderr", e);
                }
            });

            outThread.start();
            errThread.start();

            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);

            outThread.join(1000);
            errThread.join(1000);

            if (!finished) {
                process.destroyForcibly();
                throw new RuntimeException("CLI process timed out after " + timeoutSeconds + "s: " + executable);
            }

            int exitCode = process.exitValue();
            String output = stdout.toString().trim();
            String error = stderr.toString().trim();

            if (exitCode != 0) {
                log.error("CLI process failed with exit code {}. Stderr: {}", exitCode, error);
                throw new RuntimeException("CLI process exited with code " + exitCode + ": " + error);
            }

            if (!error.isEmpty()) {
                log.warn("CLI stderr (non-fatal): {}", error);
            }

            if (requireStdout && output.isEmpty() && !error.isEmpty()) {
                throw new RuntimeException("AI CLI가 응답을 생성하지 못했습니다: " + preview(error));
            }

            log.debug("CLI output length: {} chars", output.length());
            return output;

        } catch (Exception e) {
            if (e instanceof RuntimeException) {
                throw (RuntimeException) e;
            }
            throw new RuntimeException("Failed to execute CLI process", e);
        }
    }

    private String preview(String text) {
        String normalized = text.replaceAll("\\s+", " ").trim();
        return normalized.length() <= 500 ? normalized : normalized.substring(0, 500) + "...";
    }
}
