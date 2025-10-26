package com.zolty.app.service;

import com.zolty.app.dto.RuleRequest;
import com.zolty.app.dto.RuleResponse;
import com.zolty.app.mapper.RuleMapper;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RuleService {

    private final RuleRepository ruleRepository;
    private final IngredientRepository ingredientRepository;
    private final RuleIngredientRepository ruleIngredientRepository;
    private final RuleMapper ruleMapper;

    @Transactional
    public RuleResponse addRule(RuleRequest request) {
        Ingredient ingredientA = ingredientRepository.findById(request.getIngredientAId())
                .orElseThrow(() -> new RuntimeException("Ingredient A not found"));
        Ingredient ingredientB = ingredientRepository.findById(request.getIngredientBId())
                .orElseThrow(() -> new RuntimeException("Ingredient B not found"));

        // Utwórz nową regułę
        Rule rule = Rule.builder()
                .ruleType(request.getRuleType())
                .points(request.getPoints())
                .build();

        // Utwórz relację (BEZ ustawiania ID ręcznie!)
        RuleIngredient relation = RuleIngredient.builder()
                .id(new RuleIngredientId())
                .rule(rule)
                .ingredientA(ingredientA)
                .ingredientB(ingredientB)
                .build();

        // Dodaj relację do reguły
        rule.getRuleIngredients().add(relation);

        // Zapisz tylko regułę – Hibernate sam utworzy ID i powiązanie
        ruleRepository.save(rule);

        return ruleMapper.toDto(rule);
    }




    public List<RuleResponse> getAllRules() {
        return ruleRepository.findAll().stream()
                .map(ruleMapper::toDto)
                .collect(Collectors.toList());
    }
}
