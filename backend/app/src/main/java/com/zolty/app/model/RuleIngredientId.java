package com.zolty.app.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RuleIngredientId implements Serializable {
    private Long ruleId;
    private Long ingredientAId;
    private Long ingredientBId;
}
