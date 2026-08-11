package com.rmrdo.devforge.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.rmrdo.devforge.infrastructure.persistence")
public class JpaConfig {
}
