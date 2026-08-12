package com.rmrdo.devforge.infrastructure.persistence;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseMigrationInitializer {

    private final DataSource dataSource;

    @PostConstruct
    public void migrateDatabaseSchema() {
        log.info("Checking SQLite database schema for missing columns...");
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            // 1. Ensure users table exists or columns are intact
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id BLOB PRIMARY KEY,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    created_at TIMESTAMP
                )
            """);

            // 2. Check quiz_sessions columns
            Set<String> quizSessionCols = getExistingColumns(stmt, "quiz_sessions");
            if (!quizSessionCols.isEmpty()) {
                if (!quizSessionCols.contains("scope")) {
                    log.info("Adding missing column 'scope' to table 'quiz_sessions'");
                    stmt.execute("ALTER TABLE quiz_sessions ADD COLUMN scope VARCHAR(20) DEFAULT 'PERSONAL'");
                }
                if (!quizSessionCols.contains("user_id")) {
                    log.info("Adding missing column 'user_id' to table 'quiz_sessions'");
                    stmt.execute("ALTER TABLE quiz_sessions ADD COLUMN user_id BLOB");
                }
            }

            // 3. Check concepts columns
            Set<String> conceptCols = getExistingColumns(stmt, "concepts");
            if (!conceptCols.isEmpty()) {
                if (!conceptCols.contains("scope")) {
                    log.info("Adding missing column 'scope' to table 'concepts'");
                    stmt.execute("ALTER TABLE concepts ADD COLUMN scope VARCHAR(20) DEFAULT 'PERSONAL'");
                }
                if (!conceptCols.contains("user_id")) {
                    log.info("Adding missing column 'user_id' to table 'concepts'");
                    stmt.execute("ALTER TABLE concepts ADD COLUMN user_id BLOB");
                }
            }

            log.info("Database schema migration check completed successfully.");

        } catch (Exception e) {
            log.error("Error during database schema migration: {}", e.getMessage(), e);
        }
    }

    private Set<String> getExistingColumns(Statement stmt, String tableName) {
        Set<String> columns = new HashSet<>();
        try (ResultSet rs = stmt.executeQuery("PRAGMA table_info(" + tableName + ")")) {
            while (rs.next()) {
                columns.add(rs.getString("name").toLowerCase());
            }
        } catch (Exception e) {
            log.warn("Could not query table info for table '{}': {}", tableName, e.getMessage());
        }
        return columns;
    }
}
