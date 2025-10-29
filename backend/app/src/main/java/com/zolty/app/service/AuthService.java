package com.zolty.app.service;

import com.zolty.app.dto.AuthResponse;
import com.zolty.app.dto.LoginRequest;
import com.zolty.app.dto.RegisterRequest;
import com.zolty.app.dto.UserResponse;
import com.zolty.app.exception.BadRequestException;
import com.zolty.app.exception.ConflictException;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.mapper.UserMapper;
import com.zolty.app.model.Role;
import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

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

    //  Rejestracja użytkownika lokalnego
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
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setProvider("local");

        userRepository.save(user);
        return "Zarejestrowano pomyślnie";
    }

    //  Logowanie użytkownika
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Błędne hasło");
        }

        String token = generateToken(user);
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }

    // Generowanie tokenu JWT
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
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

    //  Pobranie użytkownika po e-mailu
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika"));
        return userMapper.toUserResponse(user);
    }

    //  Aktualizacja e-maila
    public UserResponse updateEmail(String currentEmail, String newEmail) {
        if (newEmail == null || newEmail.trim().isEmpty()) {
            throw new BadRequestException("Adres e-mail nie może być pusty");
        }

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        if (!newEmail.matches(emailRegex)) {
            throw new BadRequestException("Nieprawidłowy format adresu e-mail");
        }

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik nie znaleziony"));

        // 🔒 Blokada dla kont Google
        if ("google".equals(user.getProvider())) {
            throw new BadRequestException("Konto Google – nie można zmienić adresu e-mail.");
        }

        if (userRepository.existsByEmail(newEmail)) {
            throw new ConflictException("Adres e-mail jest już zajęty");
        }

        user.setEmail(newEmail);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    //  Aktualizacja nazwy użytkownika
    public UserResponse updateUsername(String currentEmail, String newUsername) {
        if (newUsername == null || newUsername.trim().isEmpty()) {
            throw new BadRequestException("Nazwa użytkownika nie może być pusta");
        }

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik nie znaleziony"));

        // Blokada dla kont Google
        if ("google".equals(user.getProvider())) {
            throw new BadRequestException("Konto Google – nie można zmienić nazwy użytkownika.");
        }

        user.setUsername(newUsername);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findByRole(Role.USER);
        return users.stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public void deleteUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Użytkownik o ID " + id + " nie istnieje"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Nie można usunąć konta administratora");
        }

        userRepository.delete(user);
    }


}
