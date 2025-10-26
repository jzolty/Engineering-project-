package com.zolty.app.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RuleResponse {
    private Long id;
    private String ruleType;
    private Integer points;
    private String ingredientA;
    private String ingredientB;
}
