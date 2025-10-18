package com.zolty.app.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

    @Bean
    public SecretKey jwtSecretKey() {
        // Stały, silny klucz – możesz zmienić na własny
        return Keys.hmacShaKeyFor("skincare_secret_key_1234567890_abcdefghij_2025_secure".getBytes());
    }
}

