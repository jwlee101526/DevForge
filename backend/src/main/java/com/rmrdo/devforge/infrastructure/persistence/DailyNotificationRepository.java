package com.rmrdo.devforge.infrastructure.persistence;

import com.rmrdo.devforge.domain.entity.DailyNotificationSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DailyNotificationRepository extends JpaRepository<DailyNotificationSubscription, UUID> {
    Optional<DailyNotificationSubscription> findByUserId(UUID userId);
}
