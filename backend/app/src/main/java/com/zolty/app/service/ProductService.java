package com.zolty.app.service;

import com.zolty.app.dto.ProductRequest;
import com.zolty.app.dto.ProductResponse;
import com.zolty.app.mapper.ProductMapper;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import com.zolty.app.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final IngredientRepository ingredientRepository;
    private final GoalRepository goalRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductResponse addProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .brand(request.getBrand())
                .category(request.getCategory())
                .skinType(request.getSkinType())
                .description(request.getDescription())
                .targetSex(request.getTargetSex())
                .targetAgeGroup(request.getTargetAgeGroup())
                .isVegan(request.getIsVegan())
                .isCrueltyFree(request.getIsCrueltyFree())
                .isEcoCertified(request.getIsEcoCertified())
                .notRecommendedDuringPregnancy(request.getNotRecommendedDuringPregnancy())
                .useTime(request.getUseTime())
                .build();

        Set<ProductIngredient> productIngredients = new HashSet<>();
        for (String ingredientName : request.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findAll().stream()
                    .filter(i -> i.getName().equalsIgnoreCase(ingredientName))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found: " + ingredientName));

            ProductIngredient rel = new ProductIngredient();
            rel.setProduct(product);
            rel.setIngredient(ingredient);
            rel.setId(new ProductIngredientId(product.getId(), ingredient.getId()));
            productIngredients.add(rel);
        }

        Set<ProductGoal> productGoals = new HashSet<>();
        for (String goalName : request.getGoals()) {
            Goal goal = goalRepository.findAll().stream()
                    .filter(g -> g.getName().equalsIgnoreCase(goalName))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalName));

            ProductGoal rel = new ProductGoal();
            rel.setProduct(product);
            rel.setGoal(goal);
            rel.setId(new ProductGoalId(product.getId(), goal.getId()));
            productGoals.add(rel);
        }

        product.setProductIngredients(productIngredients);
        product.setProductGoals(productGoals);

        productRepository.save(product);
        return productMapper.toDto(product);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }
}
