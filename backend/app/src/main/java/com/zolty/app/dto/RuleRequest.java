package com.zolty.app.dto;

import com.zolty.app.model.RuleType;
import lombok.Data;

@Data
public class RuleRequest {
    private RuleType ruleType;

    // np. "Synergy", "Conflict", "Beneficial", "Harmful"
    private Integer points;  // np. +2, -5 itd.
    private Long ingredientAId;
    private Long ingredientBId;
}
