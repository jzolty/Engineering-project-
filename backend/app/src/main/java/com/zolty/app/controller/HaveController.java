package com.zolty.app.controller;

import com.zolty.app.dto.HaveResponse;
import com.zolty.app.service.HaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/have")
@RequiredArgsConstructor
public class HaveController {

    private final HaveService haveService;

    /**
     * Tworzy relację między user, skinAnalysis i planem
     */
    @PostMapping
    public ResponseEntity<HaveResponse> createRelation(
            @RequestParam Long userId,
            @RequestParam Long skinAnalysisId,
            @RequestParam Long skincarePlanId
    ) {
        return ResponseEntity.ok(
                haveService.createRelation(userId, skinAnalysisId, skincarePlanId)
        );
    }

    /**
     * Pobiera wszystkie relacje użytkownika
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HaveResponse>> getRelationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(haveService.getRelationsByUser(userId));
    }
}
