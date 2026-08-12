plugins {
    java
    id("org.springframework.boot") version "4.0.7"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.rmrdo"
version = "0.0.1-SNAPSHOT"
description = "DevForge Backend"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
    }
}

val frontendDir = layout.projectDirectory.dir("../frontend")
val frontendDistDir = frontendDir.dir("dist")
val isWindows = System.getProperty("os.name").lowercase().contains("windows")
val frontendBuild = tasks.register<Exec>("frontendBuild") {
    workingDir = frontendDir.asFile
    if (isWindows) {
        commandLine("cmd", "/c", "pnpm", "build")
    } else {
        commandLine("pnpm", "build")
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Core
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // OpenAPI & Scalar
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-api:2.8.5")

    // SQLite
    runtimeOnly("org.xerial:sqlite-jdbc")
    implementation("org.hibernate.orm:hibernate-community-dialects")

    // Lombok
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // Dev
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    testCompileOnly("org.projectlombok:lombok")
    testAnnotationProcessor("org.projectlombok:lombok")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.withType<org.springframework.boot.gradle.tasks.run.BootRun> {
    jvmArgs("--enable-native-access=ALL-UNNAMED")
}

tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    dependsOn(frontendBuild)
    archiveFileName.set("app.jar")
    from(frontendDistDir) {
        into("static")
    }
}
