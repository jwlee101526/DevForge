package com.rmrdo.devforge.api.exception;

public record ErrorResponse(
        String error,
        String message
) {
}
