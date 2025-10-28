package com.zolty.app.mapper;

import com.zolty.app.dto.ProductRequest;
import com.zolty.app.dto.ProductResponse;
import com.zolty.app.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setBrand(request.getBrand());

        // 🔹 Kategorie (bezpieczna konwersja)
        if (request.getCategory() != null) {
            try {
                product.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid category value: " + request.getCategory());
            }
        }

        // 🔹 Opis
        product.setDescription(request.getDescription());

        // 🔹 Typy skóry (Set<SkinType>)
        if (request.getSkinTypes() != null && !request.getSkinTypes().isEmpty()) {
            Set<SkinType> skinTypeEnums = request.getSkinTypes().stream()
                    .map(s -> SkinType.valueOf(s.toUpperCase()))
                    .collect(Collectors.toSet());
            product.setSkinTypes(skinTypeEnums);
        }

        // 🔹 Płeć docelowa (enum Sex)
        if (request.getTargetSex() != null) {
            try {
                product.setTargetSex(Sex.valueOf(request.getTargetSex().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid sex value: " + request.getTargetSex());
            }
        }

        // 🔹 Grupa wiekowa (enum AgeGroup)
        if (request.getTargetAgeGroup() != null) {
            try {
                product.setTargetAgeGroup(AgeGroup.valueOf(request.getTargetAgeGroup().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid age group value: " + request.getTargetAgeGroup());
            }
        }


        product.setIsVegan(request.getIsVegan());
        product.setIsCrueltyFree(request.getIsCrueltyFree());
        product.setIsEcoCertified(request.getIsEcoCertified());
        if (request.getUseTime() != null) {
            try {
                product.setUseTime(UseTime.valueOf(request.getUseTime().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid useTime value: " + request.getUseTime());
            }
        }

        product.setNotRecommendedDuringPregnancy(request.getNotRecommendedDuringPregnancy());

        return product;
    }

    public ProductResponse toDto(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
        response.setCategory(product.getCategory() != null ? product.getCategory().name() : null);
        response.setDescription(product.getDescription());

        // Typy skóry (konwersja enumów na stringi)
        if (product.getSkinTypes() != null && !product.getSkinTypes().isEmpty()) {
            List<String> skinTypeNames = product.getSkinTypes().stream()
                    .map(Enum::name)
                    .collect(Collectors.toList());
            response.setSkinTypes(skinTypeNames);
        }

        // Płeć i wiek jako stringi
        response.setTargetSex(product.getTargetSex() != null ? product.getTargetSex().name() : null);
        response.setTargetAgeGroup(product.getTargetAgeGroup() != null ? product.getTargetAgeGroup().name() : null);

        // Pozostałe flagi
        response.setIsVegan(product.getIsVegan());
        response.setIsCrueltyFree(product.getIsCrueltyFree());
        response.setIsEcoCertified(product.getIsEcoCertified());
        response.setUseTime(product.getUseTime() != null ? product.getUseTime().name() : null);

        response.setNotRecommendedDuringPregnancy(product.getNotRecommendedDuringPregnancy());

        //  Składniki
        if (product.getProductIngredients() != null) {
            List<String> ingredientNames = product.getProductIngredients().stream()
                    .map(pi -> pi.getIngredient().getName())
                    .collect(Collectors.toList());
            response.setIngredients(ingredientNames);
        }

        // Cele
        if (product.getProductGoals() != null) {
            List<String> goalNames = product.getProductGoals().stream()
                    .map(pg -> pg.getGoal().getName())
                    .collect(Collectors.toList());
            response.setGoals(goalNames);
        }

        return response;
    }
}
