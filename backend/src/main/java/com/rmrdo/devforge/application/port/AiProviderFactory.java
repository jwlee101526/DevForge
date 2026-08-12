package com.rmrdo.devforge.application.port;

import java.util.List;
import java.util.Map;

public interface AiProviderFactory {
    AiQuizGenerator getProvider(String providerName);
    AiQuizGenerator getAvailableProvider();
    List<String> getRegisteredProviderNames();
    List<Map<String, Object>> getProviderStatuses();
}
