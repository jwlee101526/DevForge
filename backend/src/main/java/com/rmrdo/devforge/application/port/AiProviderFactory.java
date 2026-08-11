package com.rmrdo.devforge.application.port;

import java.util.List;

public interface AiProviderFactory {
    AiQuizGenerator getProvider(String providerName);
    AiQuizGenerator getAvailableProvider();
    List<String> getRegisteredProviderNames();
}
