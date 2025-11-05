package com.zolty.app.mapper;

import com.zolty.app.dto.SkincarePlanProductRequest;
import com.zolty.app.dto.SkincarePlanProductResponse;
import com.zolty.app.model.*;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class SkincarePlanProductMapper {

    public SkincarePlanProduct toEntity(SkincarePlanProductRequest request, SkincarePlan plan, Product product) {
        SkincarePlanProduct entity = new SkincarePlanProduct();

        entity.setId(new SkincarePlanProductId(plan.getId(), product.getId()));
        entity.setSkincarePlan(plan);
        entity.setProduct(product);

        return entity;
    }

    public SkincarePlanProductResponse toDto(SkincarePlanProduct entity) {
        return SkincarePlanProductResponse.builder()
                .skincarePlanId(entity.getSkincarePlan().getId())
                .productId(entity.getProduct().getId())
                .product(Map.of(
                        "id", entity.getProduct().getId(),
                        "name", entity.getProduct().getName(),
                        "brand", entity.getProduct().getBrand(),
                        "category", entity.getProduct().getCategory().name()
                ))
                .build();
    }
}
