package com.zolty.app.mapper;

import com.zolty.app.dto.ProductResponse;
import com.zolty.app.model.Product;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductResponse toDto(Product entity) {
        return ProductResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .brand(entity.getBrand())
                .category(entity.getCategory())
                .skinType(entity.getSkinType())
                .description(entity.getDescription())
                .targetSex(entity.getTargetSex())
                .targetAgeGroup(entity.getTargetAgeGroup())
                .isVegan(entity.getIsVegan())
                .isCrueltyFree(entity.getIsCrueltyFree())
                .isEcoCertified(entity.getIsEcoCertified())
                .notRecommendedDuringPregnancy(entity.getNotRecommendedDuringPregnancy())
                .useTime(entity.getUseTime())
                .ingredients(entity.getProductIngredients().stream()
                        .map(pi -> pi.getIngredient().getName())
                        .collect(Collectors.toList()))
                .goals(entity.getProductGoals().stream()
                        .map(pg -> pg.getGoal().getName())
                        .collect(Collectors.toList()))
                .build();
    }
}
