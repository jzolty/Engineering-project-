package com.zolty.app.controller;

import com.zolty.app.dto.SkinAnalysisRequest;
import com.zolty.app.dto.SkinAnalysisResponse;
import com.zolty.app.service.SkinAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skin-analysis")
@RequiredArgsConstructor
public class SkinAnalysisController {

    private final SkinAnalysisService skinAnalysisService;

    /**
     * Zapis nowej analizy skóry (formularz od użytkownika)
     * Przykład wywołania (POST):
     * /api/skin-analysis/user/3
     */
    //@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/user/{userId}")
    public ResponseEntity<SkinAnalysisResponse> saveAnalysis(
            @PathVariable Long userId,
            @RequestBody SkinAnalysisRequest request
    ) {
        return ResponseEntity.ok(skinAnalysisService.saveAnalysis(userId, request));
    }

    /**
     *  Pobranie wszystkich analiz użytkownika
     */
   // @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkinAnalysisResponse>> getUserAnalyses(@PathVariable Long userId) {
        return ResponseEntity.ok(skinAnalysisService.getUserAnalyses(userId));
    }

    /**
     * Pobranie jednej analizy po jej ID
     */
   // @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<SkinAnalysisResponse> getAnalysisById(@PathVariable Long id) {
        return ResponseEntity.ok(skinAnalysisService.getById(id));
    }
}
