package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RuleIngredient implements Serializable {

    @EmbeddedId
    private RuleIngredientId id = new RuleIngredientId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("ruleId")
    @JoinColumn(name = "rule_id")
    private Rule rule;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("ingredientAId")
    @JoinColumn(name = "ingredient_a_id")
    private Ingredient ingredientA;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("ingredientBId")
    @JoinColumn(name = "ingredient_b_id")
    private Ingredient ingredientB;
}
