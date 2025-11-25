package com.zolty.app.dto;

import com.zolty.app.model.RuleType;
import lombok.Data;

@Data
public class RuleRequest {
    private RuleType ruleType;
    private Long ingredientAId;
    private Long ingredientBId;
}
