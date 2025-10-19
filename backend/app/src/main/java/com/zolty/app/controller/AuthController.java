package com.zolty.app.controller;

import com.zolty.app.dto.AuthResponse;
import com.zolty.app.dto.LoginRequest;
import com.zolty.app.dto.RegisterRequest;
import com.zolty.app.dto.UserResponse;
import com.zolty.app.model.User;
import com.zolty.app.repository.UserRepository;
import com.zolty.app.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")

public class AuthController {

    private final AuthService authService;      // brakowało tego pola
    private final UserRepository userRepository;
    private final SecretKey secretKey;

    // Wstrzyknięcie AuthService do konstruktora
    public AuthController(AuthService authService, UserRepository userRepository, SecretKey secretKey) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.secretKey = secretKey;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getLoggedUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        String email = claims.getSubject();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie znaleziony"));

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                user.getProvider(),
                user.getProviderId(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );

        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/api/test/cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS działa!");
    }

}



