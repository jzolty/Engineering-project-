package com.zolty.app.service;

import com.zolty.app.dto.RuleRequest;
import com.zolty.app.dto.RuleResponse;
import com.zolty.app.mapper.RuleMapper;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import com.zolty.app.exception.ConflictException;
import com.zolty.app.exception.ResourceNotFoundException;
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

        if (ingredientA.getId().equals(ingredientB.getId())) {
            throw new ConflictException("Nie można dodać reguły dla tego samego składnika");
        }


        //sprawdzanie duplikatu
        boolean exists = ruleIngredientRepository.existsByIngredientAAndIngredientB(ingredientA, ingredientB)
                || ruleIngredientRepository.existsByIngredientAAndIngredientB(ingredientB, ingredientA);

        if (exists) {
            throw new ConflictException("Taka reguła już istnieje (niezależnie od kolejności składników)");
        }
        //ustawienie punktów na podstawie typu reguły
        int calculatedPoints = 0;
        if (request.getRuleType() == RuleType.BENEFICIAL) {
            calculatedPoints = 10;
        } else if (request.getRuleType() == RuleType.CONFLICT) {
            calculatedPoints = -10;
        }

        // Utwórz nową regułę
        Rule rule = Rule.builder()
                .ruleType(request.getRuleType())
                .points(calculatedPoints)
                .build();

        // Utwórz relację
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


    @Transactional
    public void deleteRule(Long id) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        ruleRepository.delete(rule);
    }

    @Transactional
    public RuleResponse updateRule(Long id, RuleRequest request) {
        Rule rule = ruleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found with id: " + id));

        rule.setRuleType(request.getRuleType());
        if (request.getRuleType() == RuleType.BENEFICIAL) {
            rule.setPoints(10);
        } else if (request.getRuleType() == RuleType.CONFLICT) {
            rule.setPoints(-10);
        }

        ruleRepository.save(rule);
        return ruleMapper.toDto(rule);
    }


}
