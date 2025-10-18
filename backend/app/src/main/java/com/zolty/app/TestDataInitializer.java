package com.zolty.app;



import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public TestDataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@skincare.pl").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@skincare.pl");
            admin.setUsername("Admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setProvider("local");
            userRepository.save(admin);
            System.out.println("✅ Stworzono konto admina: admin@skincare.pl / hasło: admin123");
        }
    }
}
