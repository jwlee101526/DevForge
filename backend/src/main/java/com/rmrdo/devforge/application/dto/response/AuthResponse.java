package com.rmrdo.devforge.application.dto.response;

public record AuthResponse(
        String token,
        UserDto user
) {}
