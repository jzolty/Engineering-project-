package com.zolty.app.service;

import com.zolty.app.dto.AuthResponse;
import com.zolty.app.dto.LoginRequest;
import com.zolty.app.dto.RegisterRequest;
import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //private final String SECRET_KEY = "skincare_secret_key_1234567890_abcdefghij_21371111111111_secret";
    // zostanie przeniesiony do env, musi być taki długi bo musi miec min 256 bitów (32znaki(//jednak biblioteka do generowania kluczy przy restarciee
    private final SecretKey SECRET_KEY;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, SecretKey secretKey) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.SECRET_KEY = secretKey;
    }


    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Użytkownik o tym e-mailu już istnieje");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setProvider("local");

        userRepository.save(user);
        return "Zarejestrowano pomyślnie";
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Nie znaleziono użytkownika");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Błędne hasło");
        }

        String token = generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    private String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 godzina
                .signWith(SECRET_KEY)
                .compact();
    }

    // metoda pomocnicza do weryfikacji tokena
    public String validateTokenAndGetEmail(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
