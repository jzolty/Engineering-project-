package com.zolty.app.service;

import com.zolty.app.dto.SkincarePlanProductResponse;
import com.zolty.app.dto.SkincarePlanResponse;
import com.zolty.app.exception.BadRequestException;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final RuleRepository ruleRepository;
    private final SkinAnalysisRepository skinAnalysisRepository;
    private final SkincarePlanRepository skincarePlanRepository;
    private final SkincarePlanProductRepository skincarePlanProductRepository;
    private final HaveRepository haveRepository;
    private final UserRepository userRepository;

    @Transactional
    public SkincarePlanResponse generateAutoPlan(Long userId, Long analysisId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        SkinAnalysis analysis = skinAnalysisRepository.findById(analysisId)
                .orElseThrow(() -> new ResourceNotFoundException("Skin analysis not found with id: " + analysisId));

        List<Product> allProducts = productRepository.findAll();
        if (allProducts.isEmpty()) {
            throw new BadRequestException("Brak produktów w bazie do analizy");
        }

        // === 1️⃣ Filtrowanie produktów ===
        List<Product> filteredProducts = allProducts.stream()
                .filter(p -> p.getUseTime() == UseTime.ANY || p.getUseTime() == analysis.getRoutineTime())
                .filter(p -> !Collections.disjoint(p.getSkinTypes(), analysis.getSkinTypes()))
                .filter(p -> analysis.getVeganPreference() == null || !analysis.getVeganPreference() || Boolean.TRUE.equals(p.getIsVegan()))
                .filter(p -> analysis.getCrueltyFreePreference() == null || !analysis.getCrueltyFreePreference() || Boolean.TRUE.equals(p.getIsCrueltyFree()))
                .filter(p -> analysis.getEcoPreference() == null || !analysis.getEcoPreference() || Boolean.TRUE.equals(p.getIsEcoCertified()))
                .filter(p -> !Boolean.TRUE.equals(analysis.getIsPregnant()) || !Boolean.TRUE.equals(p.getNotRecommendedDuringPregnancy()))
                .filter(p -> p.getTargetSex() == Sex.ALLSEX || p.getTargetSex() == analysis.getSex())
                .filter(p -> p.getTargetAgeGroup() == AgeGroup.ALL || p.getTargetAgeGroup() == analysis.getAgeGroup())
                .collect(Collectors.toList());

        if (filteredProducts.isEmpty()) {
            throw new BadRequestException("Brak produktów spełniających wymagania użytkownika");
        }

        // Składniki do unikania
        Set<String> avoid = new HashSet<>();
        if (analysis.getAvoidIngredients() != null) {
            avoid = Arrays.stream(analysis.getAvoidIngredients().split(","))
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
        }

        // === 2️⃣ Obliczanie punktacji ===
        List<Rule> rules = ruleRepository.findAll();
        Map<Product, Integer> scores = new HashMap<>();

        for (Product product : filteredProducts) {
            int score = 0;

            // Typ skóry
            for (SkinType type : analysis.getSkinTypes()) {
                if (product.getSkinTypes().contains(type)) score += 10;
            }

            // Cele
            Set<Long> productGoalIds = product.getProductGoals().stream()
                    .map(pg -> pg.getGoal().getId())
                    .collect(Collectors.toSet());
            for (Goal goal : analysis.getGoals()) {
                if (productGoalIds.contains(goal.getId())) score += 15;
            }

            // Składniki
            List<Ingredient> productIngredients = product.getProductIngredients().stream()
                    .map(ProductIngredient::getIngredient)
                    .collect(Collectors.toList());

            // Sprawdzenie reguł składników
            for (Rule rule : rules) {
                for (RuleIngredient ri : rule.getRuleIngredients()) {
                    boolean hasA = productIngredients.stream().anyMatch(i -> i.getId().equals(ri.getIngredientA().getId()));
                    boolean hasB = productIngredients.stream().anyMatch(i -> i.getId().equals(ri.getIngredientB().getId()));
                    if (hasA && hasB) {
                        score += rule.getPoints();
                    }
                }
            }

            // Składniki do unikania
            final Set<String> avoidSet = avoid;
            boolean hasForbidden = productIngredients.stream()
                    .anyMatch(i -> avoidSet.contains(i.getName().toLowerCase()));

            if (hasForbidden) score -= 50;

            scores.put(product, score);
        }

        // === 3️⃣ Grupowanie po kategorii i wybór najlepszego produktu ===
        Map<Category, Optional<Map.Entry<Product, Integer>>> bestByCategory = scores.entrySet().stream()
                .collect(Collectors.groupingBy(
                        e -> e.getKey().getCategory(),
                        Collectors.maxBy(Map.Entry.comparingByValue())
                ));

        List<Product> topProducts = bestByCategory.values().stream()
                .filter(Optional::isPresent)
                .map(opt -> opt.get().getKey())
                .collect(Collectors.toList());

        if (topProducts.isEmpty()) {
            throw new BadRequestException("Nie znaleziono odpowiednich produktów po przeliczeniu punktów");
        }

        // === 4️⃣ Utworzenie planu ===
        SkincarePlan plan = SkincarePlan.builder()
                .user(user)
                .name("Automatyczny plan " + LocalDateTime.now().toLocalDate())
                .source(PlanSource.AUTO)
                .routineTime(analysis.getRoutineTime())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        skincarePlanRepository.save(plan);

        for (Product p : topProducts) {
            skincarePlanProductRepository.save(
                    SkincarePlanProduct.builder()
                            .id(new SkincarePlanProductId(plan.getId(), p.getId()))
                            .skincarePlan(plan)
                            .product(p)
                            .build()
            );
        }

        // === 5️⃣ Tworzenie relacji HAVE ===
        Have have = Have.builder()
                .user(user)
                .skinAnalysis(analysis)
                .skincarePlan(plan)
                .build();
        haveRepository.save(have);

        // === 6️⃣ Zwracanie planu ===
        SkincarePlanResponse response = new SkincarePlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setRoutineTime(plan.getRoutineTime().name());
        response.setSource(plan.getSource().name());
        response.setCreatedAt(plan.getCreatedAt());
        response.setUpdatedAt(plan.getUpdatedAt());

// 🔹 Lista produktów — zgodna z Twoim DTO
        List<SkincarePlanProductResponse> productResponses = topProducts.stream()
                .map(p -> {
                    SkincarePlanProductResponse pr = new SkincarePlanProductResponse();
                    pr.setProductId(p.getId());
                    pr.setSkincarePlanId(plan.getId());

                    Map<String, Object> productMap = new HashMap<>();
                    productMap.put("id", p.getId());
                    productMap.put("name", p.getName());
                    productMap.put("brand", p.getBrand());
                    productMap.put("category", p.getCategory().name());

                    pr.setProduct(productMap);
                    return pr;
                })
                .collect(Collectors.toList());

        response.setProducts(productResponses);

        return response;


    }
}
