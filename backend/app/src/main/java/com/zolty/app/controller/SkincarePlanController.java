package com.zolty.app.controller;

import com.zolty.app.dto.SkincarePlanRequest;
import com.zolty.app.dto.SkincarePlanResponse;
import com.zolty.app.service.SkincarePlanService;
import com.zolty.app.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skincare-plans")
@RequiredArgsConstructor
public class SkincarePlanController {

    private final SkincarePlanService skincarePlanService;
    private final RecommendationService recommendationService;

    // 🔹 RĘCZNY plan – BEZ analizy skóry
    @PostMapping("/user/{userId}")
    public ResponseEntity<SkincarePlanResponse> createManualPlan(
            @PathVariable Long userId,
            @RequestBody SkincarePlanRequest request
    ) {
        return ResponseEntity.ok(
                skincarePlanService.createManualPlan(userId, request)
        );
    }


    @PostMapping("/user/{userId}/analysis/{analysisId}/auto")
    public ResponseEntity<SkincarePlanResponse> createAutoPlan(
            @PathVariable Long userId,
            @PathVariable Long analysisId
    ) {
        return ResponseEntity.ok(
                recommendationService.generateAutoPlan(userId, analysisId)
        );
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkincarePlanResponse>> getPlansByUser(
            @PathVariable Long userId,
            @RequestParam(required = false) String source
    ) {
        return ResponseEntity.ok(skincarePlanService.getPlansByUser(userId, source));
    }

    @GetMapping("/{planId}")
    public ResponseEntity<SkincarePlanResponse> getPlanById(@PathVariable Long planId) {
        return ResponseEntity.ok(skincarePlanService.getPlanById(planId));
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long planId) {
        skincarePlanService.deletePlan(planId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{planId}")
    public ResponseEntity<SkincarePlanResponse> updatePlan(
            @PathVariable Long planId,
            @RequestBody SkincarePlanRequest request
    ) {
        return ResponseEntity.ok(skincarePlanService.updatePlan(planId, request));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SkincarePlanResponse>> getAllPlans() {
        return ResponseEntity.ok(skincarePlanService.getAllPlans());
    }


}
