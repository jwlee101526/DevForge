package com.rmrdo.devforge.application.dto.request;

public record SaveConceptRequest(
        String suggestedWord,
        String suggestedKorean,
        String suggestedEnglishDef,
        String suggestedExample,
        String suggestedTag
) {
}
