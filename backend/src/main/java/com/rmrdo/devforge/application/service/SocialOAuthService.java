package com.rmrdo.devforge.application.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rmrdo.devforge.application.dto.request.SocialLoginRequest;
import com.rmrdo.devforge.application.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SocialOAuthService {

    private static final String GITHUB = "GITHUB";
    private static final String GOOGLE = "GOOGLE";
    private static final String KAKAO = "KAKAO";

    private final AuthService authService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${security.oauth2.client.registration.github.client-id:}")
    private String githubClientId;

    @Value("${security.oauth2.client.registration.github.client-secret:}")
    private String githubClientSecret;

    @Value("${security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @Value("${security.oauth2.client.registration.kakao.client-id:}")
    private String kakaoClientId;

    @Value("${security.oauth2.client.registration.kakao.client-secret:}")
    private String kakaoClientSecret;

    public URI buildAuthorizationUri(String provider, String mode, HttpServletRequest request) {
        String normalizedProvider = normalizeProvider(provider);
        String normalizedMode = "signup".equalsIgnoreCase(mode) ? "signup" : "login";
        String redirectUri = callbackUri(request, normalizedProvider);
        return switch (normalizedProvider) {
            case GITHUB -> URI.create("https://github.com/login/oauth/authorize"
                    + "?client_id=" + encode(required(githubClientId, GITHUB))
                    + "&redirect_uri=" + encode(redirectUri)
                    + "&scope=" + encode("read:user user:email")
                    + "&state=" + encode(normalizedMode));
            case GOOGLE -> URI.create("https://accounts.google.com/o/oauth2/v2/auth"
                    + "?client_id=" + encode(required(googleClientId, GOOGLE))
                    + "&redirect_uri=" + encode(redirectUri)
                    + "&response_type=code"
                    + "&scope=" + encode("openid email profile")
                    + "&state=" + encode(normalizedMode));
            case KAKAO -> URI.create("https://kauth.kakao.com/oauth/authorize"
                    + "?client_id=" + encode(required(kakaoClientId, KAKAO))
                    + "&redirect_uri=" + encode(redirectUri)
                    + "&response_type=code"
                    + "&state=" + encode(normalizedMode));
            default -> throw new IllegalArgumentException("지원하지 않는 소셜 프로바이더입니다.");
        };
    }

    @Transactional
    public AuthResponse authenticate(String provider, String code, HttpServletRequest request) {
        String normalizedProvider = normalizeProvider(provider);
        String redirectUri = callbackUri(request, normalizedProvider);
        SocialProfile profile = switch (normalizedProvider) {
            case GITHUB -> fetchGithubProfile(code, redirectUri);
            case GOOGLE -> fetchGoogleProfile(code, redirectUri);
            case KAKAO -> fetchKakaoProfile(code, redirectUri);
            default -> throw new IllegalArgumentException("지원하지 않는 소셜 프로바이더입니다.");
        };
        return authService.socialLogin(new SocialLoginRequest(
                normalizedProvider,
                code,
                redirectUri,
                profile.email(),
                profile.name(),
                profile.providerId()
        ));
    }

    private SocialProfile fetchGithubProfile(String code, String redirectUri) {
        String token = requestAccessToken(
                "https://github.com/login/oauth/access_token",
                "client_id=" + encode(required(githubClientId, GITHUB))
                        + "&client_secret=" + encode(required(githubClientSecret, GITHUB))
                        + "&code=" + encode(code)
                        + "&redirect_uri=" + encode(redirectUri)
        );
        JsonNode user = getJson("https://api.github.com/user", token);
        String providerId = requiredText(user, "id");
        String email = text(user, "email");
        if (email == null) {
            email = fetchGithubPrimaryEmail(token);
        }
        String name = firstNonBlank(text(user, "name"), text(user, "login"), "GitHub User");
        return new SocialProfile(providerId, email, name);
    }

    private String fetchGithubPrimaryEmail(String token) {
        JsonNode emails = getJson("https://api.github.com/user/emails", token);
        if (!emails.isArray()) {
            return null;
        }
        for (JsonNode email : emails) {
            if (email.path("primary").asBoolean(false) && email.path("verified").asBoolean(false)) {
                return text(email, "email");
            }
        }
        return null;
    }

    private SocialProfile fetchGoogleProfile(String code, String redirectUri) {
        String token = requestAccessToken(
                "https://oauth2.googleapis.com/token",
                "client_id=" + encode(required(googleClientId, GOOGLE))
                        + "&client_secret=" + encode(required(googleClientSecret, GOOGLE))
                        + "&code=" + encode(code)
                        + "&redirect_uri=" + encode(redirectUri)
                        + "&grant_type=authorization_code"
        );
        JsonNode user = getJson("https://openidconnect.googleapis.com/v1/userinfo", token);
        return new SocialProfile(
                requiredText(user, "sub"),
                text(user, "email"),
                firstNonBlank(text(user, "name"), text(user, "email"), "Google User")
        );
    }

    private SocialProfile fetchKakaoProfile(String code, String redirectUri) {
        String body = "grant_type=authorization_code"
                + "&client_id=" + encode(required(kakaoClientId, KAKAO))
                + "&code=" + encode(code)
                + "&redirect_uri=" + encode(redirectUri);
        if (kakaoClientSecret != null && !kakaoClientSecret.isBlank()) {
            body += "&client_secret=" + encode(kakaoClientSecret);
        }
        String token = requestAccessToken("https://kauth.kakao.com/oauth/token", body);
        JsonNode user = getJson("https://kapi.kakao.com/v2/user/me", token);
        JsonNode account = user.path("kakao_account");
        JsonNode profile = account.path("profile");
        return new SocialProfile(
                requiredText(user, "id"),
                text(account, "email"),
                firstNonBlank(text(profile, "nickname"), text(account, "email"), "Kakao User")
        );
    }

    private String requestAccessToken(String url, String body) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalArgumentException("소셜 인증 토큰 발급에 실패했습니다.");
            }
            JsonNode json = objectMapper.readTree(response.body());
            String accessToken = text(json, "access_token");
            if (accessToken == null) {
                throw new IllegalArgumentException("소셜 인증 토큰 응답이 올바르지 않습니다.");
            }
            return accessToken;
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new IllegalStateException("소셜 인증 서버와 통신할 수 없습니다.");
        }
    }

    private JsonNode getJson(String url, String token) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(url))
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalArgumentException("소셜 사용자 정보를 조회하지 못했습니다.");
            }
            return objectMapper.readTree(response.body());
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new IllegalStateException("소셜 사용자 정보 서버와 통신할 수 없습니다.");
        }
    }

    private String callbackUri(HttpServletRequest request, String provider) {
        return origin(request) + "/login/oauth2/code/" + provider.toLowerCase(Locale.ROOT);
    }

    public String frontendCallbackUri(HttpServletRequest request, AuthResponse response, String mode) {
        return origin(request)
                + "/auth/social/callback"
                + "#token=" + encode(response.token())
                + "&id=" + encode(response.user().id())
                + "&email=" + encode(response.user().email())
                + "&name=" + encode(response.user().name())
                + "&provider=" + encode(response.user().provider())
                + "&mode=" + encode(mode == null ? "login" : mode);
    }

    private String origin(HttpServletRequest request) {
        String proto = firstHeader(request, "X-Forwarded-Proto", request.getScheme());
        String host = firstHeader(request, "X-Forwarded-Host", request.getHeader(HttpHeaders.HOST));
        return proto + "://" + host;
    }

    private String firstHeader(HttpServletRequest request, String name, String fallback) {
        String value = request.getHeader(name);
        if (value == null || value.isBlank()) {
            return fallback;
        }
        int comma = value.indexOf(',');
        return comma >= 0 ? value.substring(0, comma).trim() : value.trim();
    }

    private String normalizeProvider(String provider) {
        if (provider == null || provider.isBlank()) {
            throw new IllegalArgumentException("소셜 프로바이더가 필요합니다.");
        }
        return provider.trim().toUpperCase(Locale.ROOT);
    }

    private String required(String value, String provider) {
        if (value == null || value.isBlank() || value.startsWith("x_")) {
            throw new IllegalStateException(provider + " 소셜 로그인 설정이 필요합니다.");
        }
        return value;
    }

    private String requiredText(JsonNode node, String field) {
        String value = text(node, field);
        if (value == null) {
            throw new IllegalArgumentException("소셜 사용자 식별자를 확인하지 못했습니다.");
        }
        return value;
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node.path(field);
        if (value.isMissingNode() || value.isNull() || value.asText().isBlank()) {
            return null;
        }
        return value.asText().trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }

    private String encode(String value) {
        return URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
    }

    private record SocialProfile(String providerId, String email, String name) {
    }
}
