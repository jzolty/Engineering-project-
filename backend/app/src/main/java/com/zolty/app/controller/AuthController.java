package com.zolty.app.controller;

import com.zolty.app.dto.AuthResponse;
import com.zolty.app.dto.LoginRequest;
import com.zolty.app.dto.RegisterRequest;
import com.zolty.app.dto.UserResponse;
import com.zolty.app.model.User;
import com.zolty.app.model.Role;
import com.zolty.app.repository.UserRepository;
import com.zolty.app.service.AuthService;
import com.zolty.app.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import javax.crypto.SecretKey;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://skincare-frontend.mangowave-5deeba63.swedencentral.azurecontainerapps.io"
})

public class AuthController {

    AuthService authService;      // brakowało tego pola
    UserRepository userRepository;
    UserMapper userMapper;
    SecretKey secretKey;

    ///
    @Value("${FRONTEND_URL:http://localhost:3000}")
    private String frontendUrl;


    // Wstrzyknięcie AuthService do konstruktora
    public AuthController(AuthService authService, UserRepository userRepository, UserMapper userMapper,SecretKey secretKey) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
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

        return ResponseEntity.ok(userMapper.toUserResponse(user));
    }

    @GetMapping("/api/test/cors")
    public ResponseEntity<String> testCors() {
        return ResponseEntity.ok("CORS działa!");
    }

    @GetMapping("/oauth2/redirect")
    public void oauth2Redirect(@AuthenticationPrincipal OAuth2User oauthUser, HttpServletResponse response) throws IOException {
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String providerId = oauthUser.getAttribute("sub");


        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Jeśli istnieje, ale nie ma provider_id — zaktualizuj
                    if (existingUser.getProviderId() == null && providerId != null) {
                        existingUser.setProviderId(providerId);
                        userRepository.save(existingUser);
                        System.out.println("Zaktualizowano provider_id dla istniejącego użytkownika: " + email);
                    }
                    return existingUser;
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(name);
                    newUser.setProvider("google");
                    newUser.setRole(Role.USER);
                    newUser.setProviderId(providerId);

                    return userRepository.save(newUser);
                });

        String token = authService.generateToken(user);

       // String redirectUrl = "http://localhost:3000/oauth2/success?token=" + token + "&role=" + user.getRole();
        String redirectUrl =
                frontendUrl + "/oauth2/success?token=" + token + "&role=" + user.getRole();

        System.out.println("Redirect URL: " + redirectUrl); // <-- tu patrzymy w logi
        response.sendRedirect(redirectUrl);
    }




    @PutMapping("/update-email")
    public ResponseEntity<UserResponse> updateEmail(HttpServletRequest request, @RequestParam String newEmail) {
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
        UserResponse updatedUser = authService.updateEmail(email, newEmail);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/update-username")
    public ResponseEntity<UserResponse> updateUsername(HttpServletRequest request, @RequestParam String newUsername) {
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
        UserResponse updatedUser = authService.updateUsername(email, newUsername);
        return ResponseEntity.ok(updatedUser);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        authService.deleteUserById(id);
        return ResponseEntity.ok("Użytkownik został usunięty.");
    }

}



