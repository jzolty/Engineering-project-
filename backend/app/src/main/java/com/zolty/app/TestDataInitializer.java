package com.zolty.app;

import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class TestDataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Konstruktor do wstrzykiwania zależności
    public TestDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ Tworzenie kont testowych przy starcie
    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            if (userRepository.findByEmail("admin@skincare.pl").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@skincare.pl");
                admin.setUsername("Admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                admin.setProvider("local");
                userRepository.save(admin);
                System.out.println("Stworzono konto ADMIN (admin@skincare.pl / admin123)");
            }

            if (userRepository.findByEmail("user@skincare.pl").isEmpty()) {
                User user = new User();
                user.setEmail("user@skincare.pl");
                user.setUsername("TestUser");
                user.setPasswordHash(passwordEncoder.encode("user123"));
                user.setRole("USER");
                user.setProvider("local");
                userRepository.save(user);
                System.out.println("Stworzono konto USER (user@skincare.pl / user123)");
            }
        };
    }

    // ✅ Naprawa haseł (opcjonalna)
    @PostConstruct
    public void fixPasswords() {
        userRepository.findAll().forEach(user -> {
            if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$")) {
                user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
                userRepository.save(user);
            }
        });
        System.out.println("🔄 Sprawdzono i naprawiono ewentualne stare hasła.");
    }
}
