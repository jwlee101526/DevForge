package com.rmrdo.devforge.application.dto.response;

public record UserDto(
        String id,
        String email,
        String name,
        String provider
) {
    public UserDto(String id, String email, String name) {
        this(id, email, name, "LOCAL");
    }
}
