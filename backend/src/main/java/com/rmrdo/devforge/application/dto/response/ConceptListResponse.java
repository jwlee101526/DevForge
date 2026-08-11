package com.rmrdo.devforge.application.dto.response;

import java.util.List;

public record ConceptListResponse(
        List<ConceptItemDto> words
) {
}
