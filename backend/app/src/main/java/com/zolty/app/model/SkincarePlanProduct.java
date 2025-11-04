package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skincare_plan_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkincarePlanProduct {

    @EmbeddedId
    private SkincarePlanProductId id;

    @ManyToOne
    @MapsId("planId")
    @JoinColumn(name = "plan_id", nullable = false)
    private SkincarePlan skincarePlan;

    @ManyToOne
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
