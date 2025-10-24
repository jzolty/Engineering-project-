//package com.zolty.app.service;
//
//import com.zolty.app.dto.AuthResponse;
//import com.zolty.app.dto.LoginRequest;
//import com.zolty.app.dto.RegisterRequest;
//import com.zolty.app.dto.UserResponse;
//import com.zolty.app.mapper.UserMapper;
//import com.zolty.app.model.User;
//import com.zolty.app.repository.UserRepository;
//import io.jsonwebtoken.Jwts;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import javax.crypto.SecretKey;
//import java.util.Date;
//import java.util.Optional;
//
//@Service
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final SecretKey SECRET_KEY;
//    private final UserMapper userMapper;
//
//    public AuthService(UserRepository userRepository,
//                       PasswordEncoder passwordEncoder,
//                       SecretKey secretKey,
//                       UserMapper userMapper) {
//        this.userRepository = userRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.SECRET_KEY = secretKey;
//        this.userMapper = userMapper;
//    }
//
//    public String register(RegisterRequest request) {
//        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
//            throw new RuntimeException("Użytkownik o tym e-mailu już istnieje");
//        }
//        if (request.getPassword().trim().length() < 6) {
//            throw new IllegalArgumentException("Hasło musi mieć co najmniej 6 znaków");
//        }
//        if (request.getPassword().contains(" ")) {
//            throw new IllegalArgumentException("Hasło nie może zawierać spacji");
//        }
//        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
//            throw new IllegalArgumentException("Niepoprawny format adresu e-mail");
//        }
//
//        User user = new User();
//        user.setEmail(request.getEmail());
//        user.setUsername(request.getUsername());
//        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
//        user.setRole("USER");
//        user.setProvider("local");
//
//        userRepository.save(user);
//        return "Zarejestrowano pomyślnie";
//    }
//
//    public AuthResponse login(LoginRequest request) {
//        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
//        if (userOpt.isEmpty()) {
//            throw new RuntimeException("Nie znaleziono użytkownika");
//        }
//
//        User user = userOpt.get();
//
//        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
//            throw new RuntimeException("Błędne hasło");
//        }
//
//        String token = generateToken(user);
//        return new AuthResponse(token, user.getEmail(), user.getRole());
//    }
//
//    public String generateToken(User user) {
//        return Jwts.builder()
//                .setSubject(user.getEmail())
//                .claim("role", user.getRole())
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
//                .signWith(SECRET_KEY)
//                .compact();
//    }
//
//    public String validateTokenAndGetEmail(String token) {
//        return Jwts.parser()
//                .setSigningKey(SECRET_KEY)
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    // 🔹 nowa metoda wykorzystująca mapper
//    public UserResponse getUserByEmail(String email) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
//        return userMapper.toDto(user);
//    }
//}
package com.zolty.app.service;

import com.zolty.app.dto.AuthResponse;
import com.zolty.app.dto.LoginRequest;
import com.zolty.app.dto.RegisterRequest;
import com.zolty.app.dto.UserResponse;
import com.zolty.app.mapper.UserMapper;
import com.zolty.app.model.Role;
import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecretKey SECRET_KEY;
    private final UserMapper userMapper;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       SecretKey secretKey,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.SECRET_KEY = secretKey;
        this.userMapper = userMapper;
    }

    // 🔹 rejestracja użytkownika
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Użytkownik o tym e-mailu już istnieje");
        }
        if (request.getPassword().trim().length() < 6) {
            throw new IllegalArgumentException("Hasło musi mieć co najmniej 6 znaków");
        }
        if (request.getPassword().contains(" ")) {
            throw new IllegalArgumentException("Hasło nie może zawierać spacji");
        }
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Niepoprawny format adresu e-mail");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ teraz "password"
        user.setRole(Role.USER); // ✅ enum zamiast Stringa
        user.setProvider("local");

        userRepository.save(user);
        return "Zarejestrowano pomyślnie";
    }

    // 🔹 logowanie użytkownika
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) { // ✅ zmiana passwordHash → password
            throw new RuntimeException("Błędne hasło");
        }

        String token = generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole().name()); // ✅ konwersja enum → String
    }

    // 🔹 generowanie tokenu JWT
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name()) // ✅ .name() zwraca "USER"/"ADMIN"
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String validateTokenAndGetEmail(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 🔹 nowa metoda wykorzystująca mapper
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
        return userMapper.toUserResponse(user); // ✅ poprawiona nazwa metody
    }
}
