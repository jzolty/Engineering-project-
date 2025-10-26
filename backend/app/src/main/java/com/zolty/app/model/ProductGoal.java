package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductGoal {

    @EmbeddedId
    private ProductGoalId id = new ProductGoalId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("goalId")
    private Goal goal;
}
