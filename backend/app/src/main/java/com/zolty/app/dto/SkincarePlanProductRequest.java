package com.zolty.app.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkincarePlanProductRequest {

    private Long skincarePlanId;
    private Long productId;
}
