package com.rmrdo.devforge.infrastructure.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private final String secretKey;

    public JwtTokenProvider(@Value("${jwt.secret:DevForgeSecretKeyForAuthenticationJwtTokenGeneration2026!}") String secretKey) {
        this.secretKey = secretKey;
    }

    public String createToken(UUID userId, String email) {
        long now = System.currentTimeMillis();
        long expiry = now + (7 * 24 * 60 * 60 * 1000L); // 7 days

        String header = base64UrlEncode("{\"alg\":\"HS256\",\"typ\":\"JWT\"}");
        String payload = base64UrlEncode(String.format("{\"sub\":\"%s\",\"email\":\"%s\",\"iat\":%d,\"exp\":%d}",
                userId.toString(), email, now / 1000, expiry / 1000));

        String signature = sign(header + "." + payload);
        return header + "." + payload + "." + signature;
    }

    public UUID getUserIdFromToken(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) {
                return null;
            }
            String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);

            // Check signature
            String expectedSig = sign(parts[0] + "." + parts[1]);
            if (!expectedSig.equals(parts[2])) {
                return null;
            }

            // Simple extract sub
            int subIdx = payloadJson.indexOf("\"sub\":\"");
            if (subIdx == -1) return null;
            int start = subIdx + 7;
            int end = payloadJson.indexOf("\"", start);
            if (end == -1) return null;

            String userIdStr = payloadJson.substring(start, end);
            return UUID.fromString(userIdStr);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        return getUserIdFromToken(token) != null;
    }

    private String sign(String data) {
        try {
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256HMAC.init(secretKeySpec);
            byte[] hash = sha256HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Error signing JWT token", e);
        }
    }

    private String base64UrlEncode(String data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data.getBytes(StandardCharsets.UTF_8));
    }
}
