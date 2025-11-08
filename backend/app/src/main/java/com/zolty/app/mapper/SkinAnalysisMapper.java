package com.zolty.app.mapper;

import com.zolty.app.dto.SkinAnalysisRequest;
import com.zolty.app.dto.SkinAnalysisResponse;
import com.zolty.app.model.*;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SkinAnalysisMapper {

    public SkinAnalysis toEntity(SkinAnalysisRequest request) {
        SkinAnalysis analysis = new SkinAnalysis();

        // Konwersja typów enum (string → enum)
        if (request.getSex() != null) {
            analysis.setSex(Sex.valueOf(request.getSex().toUpperCase()));
        }

        if (request.getRoutineTime() != null) {
            analysis.setRoutineTime(UseTime.valueOf(request.getRoutineTime().toUpperCase()));
        }

        if (request.getAgeGroup() != null) {
            analysis.setAgeGroup(AgeGroup.valueOf(request.getAgeGroup().toUpperCase()));
        }

        // Typy skóry (Set<String> → Set<SkinType>)
        if (request.getSkinTypes() != null && !request.getSkinTypes().isEmpty()) {
            Set<SkinType> types = request.getSkinTypes().stream()
                    .map(t -> SkinType.valueOf(t.toUpperCase()))
                    .collect(Collectors.toSet());
            analysis.setSkinTypes(types);
        }

        analysis.setAvoidIngredients(String.join(", ", request.getAvoidIngredients()));

        analysis.setVeganPreference(request.getVeganPreference());
        analysis.setCrueltyFreePreference(request.getCrueltyFreePreference());
        analysis.setEcoPreference(request.getEcoPreference());
        analysis.setIsPregnant(request.getIsPregnant());

        return analysis;
    }

    public SkinAnalysisResponse toDto(SkinAnalysis analysis) {
        SkinAnalysisResponse response = new SkinAnalysisResponse();

        response.setId(analysis.getId());
        response.setSex(analysis.getSex() != null ? analysis.getSex().name() : null);

        if (analysis.getSkinTypes() != null) {
            response.setSkinTypes(analysis.getSkinTypes().stream()
                    .map(Enum::name)
                    .collect(Collectors.toSet()));
        }

        if (analysis.getGoals() != null) {
            response.setGoals(analysis.getGoals().stream()
                    .map(Goal::getName)
                    .collect(Collectors.toList()));
        }

        response.setAvoidIngredients(analysis.getAvoidIngredients());
        response.setVeganPreference(analysis.getVeganPreference());
        response.setCrueltyFreePreference(analysis.getCrueltyFreePreference());
        response.setEcoPreference(analysis.getEcoPreference());
        response.setAgeGroup(analysis.getAgeGroup() != null ? analysis.getAgeGroup().name() : null);
        response.setIsPregnant(analysis.getIsPregnant());
        response.setRoutineTime(analysis.getRoutineTime() != null ? analysis.getRoutineTime().name() : null);

        return response;
    }
}
