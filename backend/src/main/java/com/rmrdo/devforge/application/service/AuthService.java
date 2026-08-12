package com.rmrdo.devforge.application.service;

import com.rmrdo.devforge.application.dto.request.LoginRequest;
import com.rmrdo.devforge.application.dto.request.SignupRequest;
import com.rmrdo.devforge.application.dto.response.AuthResponse;
import com.rmrdo.devforge.application.dto.response.UserDto;
import com.rmrdo.devforge.domain.entity.User;
import com.rmrdo.devforge.infrastructure.persistence.UserRepository;
import com.rmrdo.devforge.infrastructure.security.JwtTokenProvider;
import com.rmrdo.devforge.infrastructure.security.PasswordUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = User.builder()
                .email(email)
                .password(PasswordUtils.hashPassword(request.password()))
                .name(request.name().trim())
                .build();

        User saved = userRepository.save(user);
        String token = tokenProvider.createToken(saved.getId(), saved.getEmail());

        return new AuthResponse(token, new UserDto(saved.getId().toString(), saved.getEmail(), saved.getName()));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!PasswordUtils.verifyPassword(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String token = tokenProvider.createToken(user.getId(), user.getEmail());
        return new AuthResponse(token, new UserDto(user.getId().toString(), user.getEmail(), user.getName(), user.getProvider()));
    }

    @Transactional
    public AuthResponse socialLogin(com.rmrdo.devforge.application.dto.request.SocialLoginRequest request) {
        String provider = request.provider().trim().toUpperCase();
        String email = request.email() != null && !request.email().isBlank()
                ? request.email().trim().toLowerCase()
                : provider.toLowerCase() + "_" + UUID.randomUUID().toString().substring(0, 8) + "@social.devforge.com";
        String name = request.name() != null && !request.name().isBlank()
                ? request.name().trim()
                : provider + " User";
        String providerId = request.providerId() != null && !request.providerId().isBlank()
                ? request.providerId().trim()
                : UUID.nameUUIDFromBytes(email.getBytes()).toString();

        User user = userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> userRepository.findByEmail(email).orElse(null));

        if (user == null) {
            user = User.builder()
                    .email(email)
                    .password(PasswordUtils.hashPassword(UUID.randomUUID().toString()))
                    .name(name)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            user = userRepository.save(user);
        } else {
            user.setProvider(provider);
            user.setProviderId(providerId);
            userRepository.save(user);
        }

        String token = tokenProvider.createToken(user.getId(), user.getEmail());
        return new AuthResponse(token, new UserDto(user.getId().toString(), user.getEmail(), user.getName(), user.getProvider()));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        if (userId == null) {
            return null;
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        return new UserDto(user.getId().toString(), user.getEmail(), user.getName(), user.getProvider());
    }

    @Transactional(readOnly = true)
    public User findUserById(UUID userId) {
        if (userId == null) return null;
        return userRepository.findById(userId).orElse(null);
    }
}
