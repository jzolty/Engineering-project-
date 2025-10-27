package com.zolty.app.controller;

import com.zolty.app.dto.RuleRequest;
import com.zolty.app.dto.RuleResponse;
import com.zolty.app.service.RuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
@RequiredArgsConstructor
public class RuleController {

    private final RuleService ruleService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<RuleResponse> addRule(@RequestBody RuleRequest request) {
        return ResponseEntity.ok(ruleService.addRule(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public ResponseEntity<List<RuleResponse>> getAllRules() {
        return ResponseEntity.ok(ruleService.getAllRules());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RuleResponse> updateRule(
            @PathVariable Long id,
            @RequestBody RuleRequest request) {
        return ResponseEntity.ok(ruleService.updateRule(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        ruleService.deleteRule(id);
        return ResponseEntity.noContent().build();
    }

}
