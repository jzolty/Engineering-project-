package com.zolty.app.service;

import com.zolty.app.dto.IngredientRequest;
import com.zolty.app.dto.IngredientResponse;
import com.zolty.app.mapper.IngredientMapper;
import com.zolty.app.model.Ingredient;
import com.zolty.app.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientResponse addIngredient(IngredientRequest request) {
        Ingredient ingredient = ingredientMapper.toEntity(request);
        ingredientRepository.save(ingredient);
        return ingredientMapper.toDto(ingredient);
    }

    public List<IngredientResponse> getAllIngredients() {
        return ingredientRepository.findAll()
                .stream()
                .map(ingredientMapper::toDto)
                .collect(Collectors.toList());
    }
}
