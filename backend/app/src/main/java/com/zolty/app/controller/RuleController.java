package com.zolty.app.controller;

import com.zolty.app.dto.RuleRequest;
import com.zolty.app.dto.RuleResponse;
import com.zolty.app.service.RuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
public class RuleController {

    private final RuleService ruleService;

    @PostMapping
    public ResponseEntity<RuleResponse> addRule(@RequestBody RuleRequest request) {
        return ResponseEntity.ok(ruleService.addRule(request));
    }

    @GetMapping
    public ResponseEntity<List<RuleResponse>> getAllRules() {
        return ResponseEntity.ok(ruleService.getAllRules());
    }
}
