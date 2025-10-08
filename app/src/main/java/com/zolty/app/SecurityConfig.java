package com.zolty.app;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // wyłącza ochronę CSRF
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // pozwala na wszystko bez logowania
                )
                .formLogin(login -> login.disable()) // wyłącza formularz logowania
                .httpBasic(basic -> basic.disable()); // wyłącza autoryzację HTTP Basic

        return http.build();
    }
}
