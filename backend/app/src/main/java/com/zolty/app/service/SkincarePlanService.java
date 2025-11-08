package com.zolty.app.service;

import com.zolty.app.dto.SkincarePlanRequest;
import com.zolty.app.dto.SkincarePlanResponse;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.mapper.SkincarePlanMapper;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkincarePlanService {

    private final SkincarePlanRepository skincarePlanRepository;
    private final SkincarePlanProductRepository skincarePlanProductRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final SkinAnalysisRepository skinAnalysisRepository;
    private final HaveRepository haveRepository;
    private final SkincarePlanMapper skincarePlanMapper;

    /**
     * Tworzy plan pielęgnacyjny na podstawie danych użytkownika i analizy skóry
     */
    @Transactional
    public SkincarePlanResponse createManualPlan(Long userId, SkincarePlanRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        SkincarePlan plan = skincarePlanMapper.toEntity(request, user);

        // nadpisujemy źródło na MANUAL na wszelki wypadek
        plan.setSource(PlanSource.MANUAL);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        SkincarePlan savedPlan = skincarePlanRepository.save(plan);

        // produkty
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(request.getProductIds());
            products.forEach(product -> {
                SkincarePlanProduct rel = SkincarePlanProduct.builder()
                        .id(new SkincarePlanProductId(savedPlan.getId(), product.getId()))
                        .skincarePlan(savedPlan)
                        .product(product)
                        .build();
                skincarePlanProductRepository.save(rel);
            });
        }

        // Tu NIE wymagamy SkinAnalysis – relacja HAVE tylko jeśli kiedyś będziesz chciała
        // powiązać ręczny plan z konkretną analizą.

        return skincarePlanMapper.toDto(savedPlan);
    }

    /**
     * Pobiera wszystkie plany użytkownika
     */
    public List<SkincarePlanResponse> getPlansByUser(Long userId, String source) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<SkincarePlan> plans;

        if (source != null && !source.isBlank()) {
            try {
                PlanSource planSource = PlanSource.valueOf(source.toUpperCase());
                plans = skincarePlanRepository.findByUserAndSource(user, planSource);
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException("Invalid source type: " + source);
            }
        } else {
            plans = skincarePlanRepository.findByUser(user);
        }

        return plans.stream()
                .map(skincarePlanMapper::toDto)
                .collect(Collectors.toList());
    }


    /**
     * Pobiera plan po ID
     */
    public SkincarePlanResponse getPlanById(Long planId) {
        SkincarePlan plan = skincarePlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Skincare plan not found with id: " + planId));

        return skincarePlanMapper.toDto(plan);
    }

    @Transactional
    public void deletePlan(Long planId) {
        if (!skincarePlanRepository.existsById(planId)) {
            throw new ResourceNotFoundException("Plan not found with id: " + planId);
        }
        skincarePlanRepository.deleteById(planId);
    }
    @Transactional
    public SkincarePlanResponse updatePlan(Long planId, SkincarePlanRequest request) {
        SkincarePlan plan = skincarePlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + planId));

        //  Aktualizacja pól podstawowych
        if (request.getName() != null) plan.setName(request.getName());
        if (request.getNote() != null) plan.setNote(request.getNote());
        if (request.getRoutineTime() != null) {
            try {
                plan.setRoutineTime(UseTime.valueOf(request.getRoutineTime().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new ResourceNotFoundException("Invalid routineTime: " + request.getRoutineTime());
            }
        }

        plan.setUpdatedAt(LocalDateTime.now());

        //  Aktualizacja produktów (pełna synchronizacja listy)
        if (request.getProductIds() != null) {
            //  Usuń wszystkie stare relacje (zarówno w repozytorium, jak i z encji planu)
            skincarePlanProductRepository.deleteAll(plan.getSkincarePlanProducts());
            plan.getSkincarePlanProducts().clear();

            //  Dodaj nowe relacje z przekazanych ID
            if (!request.getProductIds().isEmpty()) {
                List<Product> newProducts = productRepository.findAllById(request.getProductIds());
                List<SkincarePlanProduct> newRelations = newProducts.stream()
                        .map(product -> SkincarePlanProduct.builder()
                                .id(new SkincarePlanProductId(plan.getId(), product.getId()))
                                .skincarePlan(plan)
                                .product(product)
                                .build())
                        .collect(Collectors.toList());

                skincarePlanProductRepository.saveAll(newRelations);
                plan.getSkincarePlanProducts().addAll(newRelations);
            }
        }

        // Zapisz plan z nowymi relacjami
        SkincarePlan updated = skincarePlanRepository.save(plan);

        // Odśwież plan (z pełnymi produktami)
        SkincarePlan refreshed = skincarePlanRepository.findById(updated.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found after update"));

        return skincarePlanMapper.toDto(refreshed);
    }




}
