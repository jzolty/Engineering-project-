//package com.zolty.app.mapper;
//
//import com.zolty.app.dto.ProductRequest;
//import com.zolty.app.dto.ProductResponse;
//import com.zolty.app.model.*;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.stream.Collectors;
//
//@Component
//public class ProductMapper {
//
//    public Product toEntity(ProductRequest request) {
//        Product product = new Product();
//        product.setName(request.getName());
//        product.setBrand(request.getBrand());
//
//        // Kategorie (bezpieczna konwersja)
//        if (request.getCategory() != null) {
//            try {
//                product.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
//            } catch (IllegalArgumentException e) {
//                throw new IllegalArgumentException("Invalid category value: " + request.getCategory());
//            }
//        }
//
//        //  Opis
//        product.setDescription(request.getDescription());
//
//        //  Typy skóry (Set<SkinType>)
//        if (request.getSkinTypes() != null && !request.getSkinTypes().isEmpty()) {
//            Set<SkinType> skinTypeEnums = request.getSkinTypes().stream()
//                    .map(s -> SkinType.valueOf(s.toUpperCase()))
//                    .collect(Collectors.toSet());
//            product.setSkinTypes(skinTypeEnums);
//        }
//
//        //  Płeć docelowa (enum Sex)
//        if (request.getTargetSex() != null) {
//            try {
//                product.setTargetSex(Sex.valueOf(request.getTargetSex().toUpperCase()));
//            } catch (IllegalArgumentException e) {
//                throw new IllegalArgumentException("Invalid sex value: " + request.getTargetSex());
//            }
//        }
//
//        //  Grupa wiekowa (enum AgeGroup)
//        if (request.getTargetAgeGroup() != null) {
//            try {
//                product.setTargetAgeGroup(AgeGroup.valueOf(request.getTargetAgeGroup().toUpperCase()));
//            } catch (IllegalArgumentException e) {
//                throw new IllegalArgumentException("Invalid age group value: " + request.getTargetAgeGroup());
//            }
//        }
//
//
//        product.setIsVegan(request.getIsVegan());
//        product.setIsCrueltyFree(request.getIsCrueltyFree());
//        product.setIsEcoCertified(request.getIsEcoCertified());
//        if (request.getUseTime() != null) {
//            try {
//                product.setUseTime(UseTime.valueOf(request.getUseTime().toUpperCase()));
//            } catch (IllegalArgumentException e) {
//                throw new IllegalArgumentException("Invalid useTime value: " + request.getUseTime());
//            }
//        }
//
//        product.setNotRecommendedDuringPregnancy(request.getNotRecommendedDuringPregnancy());
//
//        return product;
//    }
//
//    public ProductResponse toDto(Product product) {
//        ProductResponse response = new ProductResponse();
//        response.setId(product.getId());
//        response.setName(product.getName());
//        response.setBrand(product.getBrand());
//        response.setCategory(product.getCategory() != null ? product.getCategory().name() : null);
//        response.setDescription(product.getDescription());
//
//        // Typy skóry (konwersja enumów na stringi)
//        if (product.getSkinTypes() != null && !product.getSkinTypes().isEmpty()) {
//            List<String> skinTypeNames = product.getSkinTypes().stream()
//                    .map(Enum::name)
//                    .collect(Collectors.toList());
//            response.setSkinTypes(skinTypeNames);
//        }
//
//        // Płeć i wiek jako stringi
//        response.setTargetSex(product.getTargetSex() != null ? product.getTargetSex().name() : null);
//        response.setTargetAgeGroup(product.getTargetAgeGroup() != null ? product.getTargetAgeGroup().name() : null);
//
//        // Pozostałe flagi
//        response.setIsVegan(product.getIsVegan());
//        response.setIsCrueltyFree(product.getIsCrueltyFree());
//        response.setIsEcoCertified(product.getIsEcoCertified());
//        response.setUseTime(product.getUseTime() != null ? product.getUseTime().name() : null);
//
//        response.setNotRecommendedDuringPregnancy(product.getNotRecommendedDuringPregnancy());
//
//
//
//        //  Składniki (z ID i nazwą)
//        if (product.getProductIngredients() != null) {
//            List<Map<String, Object>> ingredients = product.getProductIngredients().stream()
//                    .map(pi -> (Map<String, Object>) Map.<String, Object>of(
//                            "id", pi.getIngredient().getId(),
//                            "name", pi.getIngredient().getName()
//                    ))
//                    .sorted((a, b) -> a.get("name").toString().compareToIgnoreCase(b.get("name").toString()))
//                    .collect(Collectors.toList());
//            response.setIngredients(ingredients);
//        }
//
////  Cele (z ID i nazwą)
//        if (product.getProductGoals() != null) {
//            List<Map<String, Object>> goals = product.getProductGoals().stream()
//                    .map(pg -> (Map<String, Object>) Map.<String, Object>of(
//                            "id", pg.getGoal().getId(),
//                            "name", pg.getGoal().getName()
//                    ))
//                    .sorted((a, b) -> a.get("name").toString().compareToIgnoreCase(b.get("name").toString()))
//                    .collect(Collectors.toList());
//            response.setGoals(goals);
//        }
//
//
//
//        return response;
//    }
//}
package com.zolty.app.mapper;

import com.zolty.app.dto.ProductRequest;
import com.zolty.app.dto.ProductResponse;
import com.zolty.app.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        if (request == null) return null;

        Product product = new Product();
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setDescription(request.getDescription());

        // Kategorie
        if (request.getCategory() != null) {
            try {
                product.setCategory(Category.valueOf(request.getCategory().toUpperCase()));
            } catch (IllegalArgumentException e) {
                product.setCategory(Category.OTHER);
            }
        }

        // Typy skóry
        if (request.getSkinTypes() != null && !request.getSkinTypes().isEmpty()) {
            Set<SkinType> skinTypeEnums = request.getSkinTypes().stream()
                    .map(s -> {
                        try {
                            return SkinType.valueOf(s.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            throw new IllegalArgumentException("Invalid skin type: " + s);
                        }
                    })
                    .collect(Collectors.toSet());
            product.setSkinTypes(skinTypeEnums);
        }

        // Płeć docelowa
        if (request.getTargetSex() != null) {
            try {
                product.setTargetSex(Sex.valueOf(request.getTargetSex().toUpperCase()));
            } catch (IllegalArgumentException e) {
                product.setTargetSex(Sex.ALLSEX);
            }
        }

        // Grupa wiekowa
        if (request.getTargetAgeGroup() != null) {
            try {
                product.setTargetAgeGroup(AgeGroup.valueOf(request.getTargetAgeGroup().toUpperCase()));
            } catch (IllegalArgumentException e) {
                product.setTargetAgeGroup(AgeGroup.ALL);
            }
        }

        // Czas użycia
        if (request.getUseTime() != null) {
            try {
                product.setUseTime(UseTime.valueOf(request.getUseTime().toUpperCase()));
            } catch (IllegalArgumentException e) {
                product.setUseTime(UseTime.ANY);
            }
        }

        // Flagi logiczne
        product.setIsVegan(request.getIsVegan());
        product.setIsCrueltyFree(request.getIsCrueltyFree());
        product.setIsEcoCertified(request.getIsEcoCertified());
        product.setNotRecommendedDuringPregnancy(request.getNotRecommendedDuringPregnancy());

        // ⚠️ Nie dotykamy ingredientIds, ingredientNames, goalIds – obsługuje to ProductService
        return product;
    }

    public ProductResponse toDto(Product product) {
        if (product == null) return null;

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
        response.setCategory(product.getCategory() != null ? product.getCategory().name() : null);
        response.setDescription(product.getDescription());

        // Typy skóry
        if (product.getSkinTypes() != null && !product.getSkinTypes().isEmpty()) {
            List<String> skinTypeNames = product.getSkinTypes().stream()
                    .map(Enum::name)
                    .collect(Collectors.toList());
            response.setSkinTypes(skinTypeNames);
        }

        // Płeć i wiek
        response.setTargetSex(product.getTargetSex() != null ? product.getTargetSex().name() : null);
        response.setTargetAgeGroup(product.getTargetAgeGroup() != null ? product.getTargetAgeGroup().name() : null);

        // Flagi
        response.setIsVegan(product.getIsVegan());
        response.setIsCrueltyFree(product.getIsCrueltyFree());
        response.setIsEcoCertified(product.getIsEcoCertified());
        response.setUseTime(product.getUseTime() != null ? product.getUseTime().name() : null);
        response.setNotRecommendedDuringPregnancy(product.getNotRecommendedDuringPregnancy());

        // Składniki
        if (product.getProductIngredients() != null) {
            List<Map<String, Object>> ingredients = product.getProductIngredients().stream()
                    .map(pi -> Map.<String, Object>of(
                            "id", pi.getIngredient().getId(),
                            "name", pi.getIngredient().getName()
                    ))
                    .sorted((a, b) -> a.get("name").toString().compareToIgnoreCase(b.get("name").toString()))
                    .collect(Collectors.toList());
            response.setIngredients(ingredients);
        }

        // Cele
        if (product.getProductGoals() != null) {
            List<Map<String, Object>> goals = product.getProductGoals().stream()
                    .map(pg -> Map.<String, Object>of(
                            "id", pg.getGoal().getId(),
                            "name", pg.getGoal().getName()
                    ))
                    .sorted((a, b) -> a.get("name").toString().compareToIgnoreCase(b.get("name").toString()))
                    .collect(Collectors.toList());
            response.setGoals(goals);
        }

        return response;
    }
}


