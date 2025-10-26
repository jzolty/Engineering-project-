package com.zolty.app.controller;

import com.zolty.app.dto.GoalRequest;
import com.zolty.app.dto.GoalResponse;
import com.zolty.app.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    public ResponseEntity<GoalResponse> addGoal(@RequestBody GoalRequest request) {
        return ResponseEntity.ok(goalService.addGoal(request));
    }

    @GetMapping
    public ResponseEntity<List<GoalResponse>> getAllGoals() {
        return ResponseEntity.ok(goalService.getAllGoals());
    }
}
