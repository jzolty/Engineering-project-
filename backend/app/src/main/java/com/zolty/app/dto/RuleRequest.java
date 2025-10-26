package com.zolty.app.dto;

import lombok.Data;

@Data
public class RuleRequest {
    private String ruleType; // np. "Synergy", "Conflict", "Beneficial", "Harmful"
    private Integer points;  // np. +2, -5 itd.
    private Long ingredientAId;
    private Long ingredientBId;
}
