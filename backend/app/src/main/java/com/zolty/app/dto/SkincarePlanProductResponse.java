package com.zolty.app.dto;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkincarePlanProductResponse {

    private Long skincarePlanId;
    private Long productId;

    // dane produktu — uproszczona wersja (np. do wyświetlenia w UI)
    private Map<String, Object> product;
    // przykładowo:
    // { "id": 1, "name": "Krem nawilżający", "brand": "Floslek", "category": "CREAM" }
}
