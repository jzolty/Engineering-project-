package com.zolty.app.mapper;

import com.zolty.app.dto.RuleResponse;
import com.zolty.app.model.Rule;
import com.zolty.app.model.RuleIngredient;
import org.springframework.stereotype.Component;

@Component
public class RuleMapper {

    public RuleResponse toDto(Rule rule) {
        RuleIngredient rel = rule.getRuleIngredients().stream().findFirst().orElse(null);

        return RuleResponse.builder()
                .id(rule.getId())
                .ruleType(rule.getRuleType())
                .points(rule.getPoints())
                .ingredientA(rel != null ? rel.getIngredientA().getName() : null)
                .ingredientB(rel != null ? rel.getIngredientB().getName() : null)
                .build();
    }
}
