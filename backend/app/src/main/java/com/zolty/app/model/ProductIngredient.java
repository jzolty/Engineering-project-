package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductIngredient {

    @EmbeddedId
    private ProductIngredientId id = new ProductIngredientId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("ingredientId")
    private Ingredient ingredient;
}
