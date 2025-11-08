package com.zolty.app.controller;

import com.zolty.app.dto.SkincarePlanResponse;
import com.zolty.app.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/auto")
    public ResponseEntity<SkincarePlanResponse> generateAutoPlan(
            @RequestParam Long userId,
            @RequestParam Long analysisId
    ) {
        return ResponseEntity.ok(
                recommendationService.generateAutoPlan(userId, analysisId)
        );
    }
}
