package com.zolty.app.mapper;

import com.zolty.app.dto.SkincarePlanProductResponse;
import com.zolty.app.dto.SkincarePlanRequest;
import com.zolty.app.dto.SkincarePlanResponse;
import com.zolty.app.model.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SkincarePlanMapper {

    public SkincarePlan toEntity(SkincarePlanRequest request, User user) {
        SkincarePlan plan = new SkincarePlan();

        plan.setName(request.getName());
        plan.setNote(request.getNote());

        // 🔹 Zamiana String → Enum (PlanSource)
        if (request.getSource() != null) {
            plan.setSource(PlanSource.valueOf(request.getSource().toUpperCase()));
        }

        // 🔹 Zamiana String → Enum (UseTime)
        if (request.getRoutineTime() != null) {
            plan.setRoutineTime(UseTime.valueOf(request.getRoutineTime().toUpperCase()));
        }

        plan.setUser(user);
        return plan;
    }

    public SkincarePlanResponse toDto(SkincarePlan plan) {
        SkincarePlanResponse response = new SkincarePlanResponse();

        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setNote(plan.getNote());
        response.setSource(plan.getSource() != null ? plan.getSource().name() : null);
        response.setRoutineTime(plan.getRoutineTime() != null ? plan.getRoutineTime().name() : null);
        response.setCreatedAt(plan.getCreatedAt());
        response.setUpdatedAt(plan.getUpdatedAt());

        // Produkty w planie
        if (plan.getSkincarePlanProducts() != null) {
            List<SkincarePlanProductResponse> products = plan.getSkincarePlanProducts().stream()
                    .map(rel -> SkincarePlanProductResponse.builder()
                            .skincarePlanId(plan.getId())
                            .productId(rel.getProduct().getId())
                            .product(Map.of(
                                    "id", rel.getProduct().getId(),
                                    "name", rel.getProduct().getName(),
                                    "brand", rel.getProduct().getBrand(),
                                    "category", rel.getProduct().getCategory().name()
                            ))
                            .build())
                    .collect(Collectors.toList());

            response.setProducts(products);

        }

        // Dane użytkownika (minimalne)
        if (plan.getUser() != null) {
            response.setUser(Map.of(
                    "id", plan.getUser().getId(),
                    "username", plan.getUser().getUsername(),
                    "email", plan.getUser().getEmail()
            ));
        }

        return response;
    }
}
