package com.rmrdo.devforge.infrastructure.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder()
                .group("v1-api")
                .pathsToMatch("/api/v1/**")
                .build();
    }
}
