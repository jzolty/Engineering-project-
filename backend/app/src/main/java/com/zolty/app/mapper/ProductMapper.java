package com.zolty.app.mapper;

import com.zolty.app.dto.ProductRequest;
import com.zolty.app.dto.ProductResponse;
import com.zolty.app.model.Product;
import com.zolty.app.model.Category;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.stream.Collectors;
@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setBrand(request.getBrand());

        // bezpieczna konwersja kategorii (jeśli nieprawidłowa, zostanie OTHER)
        if (request.getCategory() != null) {
            try {
                product.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid category value: " + request.getCategory());
            }
        }

        //product.setCategory(Category.valueOf(request.getCategory().toUpperCase()));

        product.setDescription(request.getDescription());
        product.setSkinType(request.getSkinType());
        product.setTargetSex(request.getTargetSex());
        product.setTargetAgeGroup(request.getTargetAgeGroup());
        product.setIsVegan(request.getIsVegan());
        product.setIsCrueltyFree(request.getIsCrueltyFree());
        product.setIsEcoCertified(request.getIsEcoCertified());
        product.setUseTime(request.getUseTime());
        product.setNotRecommendedDuringPregnancy(request.getNotRecommendedDuringPregnancy());
        return product;
    }

    public ProductResponse toDto(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
       // response.setCategory(product.getCategory() != null ? product.getCategory().name() : null);
        response.setCategory(product.getCategory().name());

        response.setDescription(product.getDescription());
        response.setSkinType(product.getSkinType());
        response.setTargetSex(product.getTargetSex());
        response.setTargetAgeGroup(product.getTargetAgeGroup());
        response.setIsVegan(product.getIsVegan());
        response.setIsCrueltyFree(product.getIsCrueltyFree());
        response.setIsEcoCertified(product.getIsEcoCertified());
        response.setUseTime(product.getUseTime());
        response.setNotRecommendedDuringPregnancy(product.getNotRecommendedDuringPregnancy());


        //Dodaj listę nazw składników
        if (product.getProductIngredients() != null) {
            List<String> ingredientNames = product.getProductIngredients().stream()
                    .map(pi -> pi.getIngredient().getName())
                    .collect(Collectors.toList());
            response.setIngredients(ingredientNames);
        }

        // Dodaj listę nazw celów
        if (product.getProductGoals() != null) {
            List<String> goalNames = product.getProductGoals().stream()
                    .map(pg -> pg.getGoal().getName())
                    .collect(Collectors.toList());
            response.setGoals(goalNames);
        }


        return response;
    }
}
