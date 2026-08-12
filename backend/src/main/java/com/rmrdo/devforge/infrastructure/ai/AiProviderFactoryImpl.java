package com.rmrdo.devforge.infrastructure.ai;

import com.rmrdo.devforge.application.port.AiProviderFactory;
import com.rmrdo.devforge.application.port.AiQuizGenerator;
import com.rmrdo.devforge.infrastructure.config.AiProviderProperties;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AiProviderFactoryImpl implements AiProviderFactory {

    private final Map<String, AiQuizGenerator> providerMap;
    private final String defaultProviderName;

    public AiProviderFactoryImpl(List<AiQuizGenerator> providers, AiProviderProperties properties) {
        this.providerMap = providers.stream()
                .collect(Collectors.toMap(
                        p -> p.getProviderName().toLowerCase(),
                        p -> p,
                        (existing, replacement) -> existing
                ));
        this.defaultProviderName = properties.getDefaultProvider();
    }

    @Override
    public AiQuizGenerator getProvider(String providerName) {
        String name = (providerName != null) ? providerName.toLowerCase() : defaultProviderName.toLowerCase();
        AiQuizGenerator provider = providerMap.get(name);
        if (provider == null) {
            throw new IllegalArgumentException("AI provider '" + name + "' is not registered. Available: " + getRegisteredProviderNames());
        }
        return provider;
    }

    @Override
    public AiQuizGenerator getAvailableProvider() {
        AiQuizGenerator defaultProvider = providerMap.get(defaultProviderName.toLowerCase());
        if (defaultProvider != null && defaultProvider.isAvailable()) {
            return defaultProvider;
        }

        for (AiQuizGenerator provider : providerMap.values()) {
            if (provider.isAvailable()) {
                return provider;
            }
        }

        throw new IllegalStateException("사용 가능한 AI 프로바이더가 없습니다. 등록된 프로바이더: " + getRegisteredProviderNames());
    }

    @Override
    public List<String> getRegisteredProviderNames() {
        return providerMap.values().stream()
                .map(AiQuizGenerator::getProviderName)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getProviderStatuses() {
        return providerMap.values().stream()
                .map(AiQuizGenerator::getStatus)
                .collect(Collectors.toList());
    }
}
