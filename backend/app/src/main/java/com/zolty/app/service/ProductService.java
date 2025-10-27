package com.zolty.app.service;

import com.zolty.app.dto.ProductRequest;
import com.zolty.app.dto.ProductResponse;

import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.mapper.ProductMapper;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final IngredientRepository ingredientRepository;
    private final GoalRepository goalRepository;
    private final ProductIngredientRepository productIngredientRepository;
    private final ProductGoalRepository productGoalRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductResponse addProduct(ProductRequest request) {
        // utwórz obiekt z mappera (ustawia m.in. kategorię jako enum)
        Product product = productMapper.toEntity(request);
        productRepository.save(product);

        //  powiązanie składników
        if (request.getIngredientIds() != null) {
            for (Long ingredientId : request.getIngredientIds()) {
                Ingredient ingredient = ingredientRepository.findById(ingredientId)
                        .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found: " + ingredientId));
                ProductIngredient relation = new ProductIngredient(
                        new ProductIngredientId(product.getId(), ingredient.getId()),
                        product,
                        ingredient
                );
                productIngredientRepository.save(relation);
            }
        }

        //  powiązanie celów
        if (request.getGoalIds() != null) {
            for (Long goalId : request.getGoalIds()) {
                Goal goal = goalRepository.findById(goalId)
                        .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalId));
                ProductGoal relation = new ProductGoal(
                        new ProductGoalId(product.getId(), goal.getId()),
                        product,
                        goal
                );
                productGoalRepository.save(relation);
            }
        }
        product = productRepository.findById(product.getId()).orElseThrow();
        return productMapper.toDto(product);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // usuń powiązania (żeby nie złamać kluczy obcych)
        productIngredientRepository.deleteByProductId(product.getId());
        productGoalRepository.deleteByProductId(product.getId());

        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDto(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // 🔹 aktualizujemy pola produktu
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        //product.setCategory(request.getCategory());
        //STRING->ENUM
        try {
            product.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
        } catch (IllegalArgumentException | NullPointerException e) {
            product.setCategory(Category.OTHER);
        }

        product.setDescription(request.getDescription());
        product.setSkinType(request.getSkinType());
        product.setTargetSex(request.getTargetSex());
        product.setTargetAgeGroup(request.getTargetAgeGroup());
        product.setIsVegan(request.getIsVegan());
        product.setIsCrueltyFree(request.getIsCrueltyFree());
        product.setIsEcoCertified(request.getIsEcoCertified());
        product.setUseTime(request.getUseTime());
        product.setNotRecommendedDuringPregnancy(request.getNotRecommendedDuringPregnancy());

        // 🔹 jeśli chcesz aktualizować składniki i cele (opcjonalnie)
        if (request.getIngredientIds() != null) {
            productIngredientRepository.deleteByProductId(product.getId());
            for (Long ingredientId : request.getIngredientIds()) {
                Ingredient ingredient = ingredientRepository.findById(ingredientId)
                        .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found: " + ingredientId));
                ProductIngredient relation = new ProductIngredient(
                        new ProductIngredientId(product.getId(), ingredient.getId()),
                        product,
                        ingredient
                );
                productIngredientRepository.save(relation);
            }
        }

        if (request.getGoalIds() != null) {
            productGoalRepository.deleteByProductId(product.getId());
            for (Long goalId : request.getGoalIds()) {
                Goal goal = goalRepository.findById(goalId)
                        .orElseThrow(() -> new ResourceNotFoundException("Goal not found: " + goalId));
                ProductGoal relation = new ProductGoal(
                        new ProductGoalId(product.getId(), goal.getId()),
                        product,
                        goal
                );
                productGoalRepository.save(relation);
            }
        }

        productRepository.save(product);
        product = productRepository.findById(product.getId()).orElseThrow();
        return productMapper.toDto(product);
    }

}
