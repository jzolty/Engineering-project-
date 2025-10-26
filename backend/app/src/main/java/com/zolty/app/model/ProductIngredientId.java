package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductIngredientId implements Serializable {
    private Long productId;
    private Long ingredientId;
}
