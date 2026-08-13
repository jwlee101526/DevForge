package com.rmrdo.devforge.api.controller;

import com.rmrdo.devforge.application.dto.response.AuthResponse;
import com.rmrdo.devforge.application.service.SocialOAuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class SocialOAuthController {

    private final SocialOAuthService socialOAuthService;

    @GetMapping("/oauth2/authorization/{provider}")
    public ResponseEntity<Void> authorize(
            @PathVariable String provider,
            @RequestParam(defaultValue = "login") String mode,
            HttpServletRequest request
    ) {
        URI authorizationUri = socialOAuthService.buildAuthorizationUri(provider, mode, request);
        return ResponseEntity.status(302).header(HttpHeaders.LOCATION, authorizationUri.toString()).build();
    }

    @GetMapping("/login/oauth2/code/{provider}")
    public ResponseEntity<Void> callback(
            @PathVariable String provider,
            @RequestParam String code,
            @RequestParam(defaultValue = "login") String state,
            HttpServletRequest request
    ) {
        AuthResponse response = socialOAuthService.authenticate(provider, code, request);
        String callbackUri = socialOAuthService.frontendCallbackUri(request, response, state);
        return ResponseEntity.status(302).header(HttpHeaders.LOCATION, callbackUri).build();
    }
}
