package com.rmrdo.devforge.infrastructure.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Configuration
@ConfigurationProperties(prefix = "ai-provider")
public class AiProviderProperties {

    private String defaultProvider = "Antigravity";
    private AntigravityConfig antigravity = new AntigravityConfig();

    @Data
    public static class AntigravityConfig {
        private String executablePath = "agy";
        private String outputFormat = "json";
        private String model;
        private int timeoutSeconds = 300;
        private String logFile;
        private Map<String, String> env = new HashMap<>();
        private boolean autoConfigurePermissions = true;
        private String sharedConfigPath;
        private List<String> permissionAllow = new ArrayList<>(List.of("command(agy --help)"));
    }
}
