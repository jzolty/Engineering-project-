package com.zolty.app.mapper;

import com.zolty.app.dto.IngredientRequest;
import com.zolty.app.dto.IngredientResponse;
import com.zolty.app.model.Ingredient;
import org.springframework.stereotype.Component;

@Component
public class IngredientMapper {

    public Ingredient toEntity(IngredientRequest request) {
        Ingredient ingredient = new Ingredient();
        ingredient.setName(request.getName());
        return ingredient;
    }

    public IngredientResponse toDto(Ingredient entity) {
        return IngredientResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
