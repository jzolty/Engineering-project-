package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class SkincarePlanProductId implements Serializable {
    private Long planId;
    private Long productId;
}
