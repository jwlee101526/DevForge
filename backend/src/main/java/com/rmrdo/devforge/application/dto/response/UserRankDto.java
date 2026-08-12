package com.rmrdo.devforge.application.dto.response;

public record UserRankDto(
        String rank,         // "F", "E", "D", "C", "B", "A", "S"
        int totalXp,
        int nextRankXp,
        int currentRankBaseXp,
        double progressPercentage,
        String rankTitle,
        String color
) {
    public static UserRankDto calculate(int totalXp) {
        if (totalXp >= 2500) {
            return new UserRankDto("S", totalXp, 2500, 2500, 100.0, "전설의 수석 아키텍트", "purple");
        } else if (totalXp >= 1500) {
            double pct = Math.min(100.0, ((totalXp - 1500) / 1000.0) * 100);
            return new UserRankDto("A", totalXp, 2500, 1500, pct, "마스터 백엔드 엔지니어", "indigo");
        } else if (totalXp >= 1000) {
            double pct = Math.min(100.0, ((totalXp - 1000) / 500.0) * 100);
            return new UserRankDto("B", totalXp, 1500, 1000, pct, "시니어 시니어 개발자", "blue");
        } else if (totalXp >= 600) {
            double pct = Math.min(100.0, ((totalXp - 600) / 400.0) * 100);
            return new UserRankDto("C", totalXp, 1000, 600, pct, "미드레벨 코더", "emerald");
        } else if (totalXp >= 300) {
            double pct = Math.min(100.0, ((totalXp - 300) / 300.0) * 100);
            return new UserRankDto("D", totalXp, 600, 300, pct, "주니어 엔지니어", "amber");
        } else if (totalXp >= 100) {
            double pct = Math.min(100.0, ((totalXp - 100) / 200.0) * 100);
            return new UserRankDto("E", totalXp, 300, 100, pct, "입문 개발 수습생", "slate");
        } else {
            double pct = Math.min(100.0, (totalXp / 100.0) * 100);
            return new UserRankDto("F", totalXp, 100, 0, pct, "코드 비기너", "gray");
        }
    }
}
