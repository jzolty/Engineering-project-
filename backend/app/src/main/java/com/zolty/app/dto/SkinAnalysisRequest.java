package com.zolty.app.dto;

import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkinAnalysisRequest {

    // Preferencje użytkownika
    private String sex; // enum: MALE / FEMALE
    private Set<String> skinTypes;
    private Set<Long> goalIds; // cele pielęgnacyjne (np. nawilżenie, anti-aging)
    private List<String> avoidIngredients; // tekstowa lista składników do unikania

    // Dodatkowe preferencje
    private Boolean veganPreference;
    private Boolean crueltyFreePreference;
    private Boolean ecoPreference;
    private String ageGroup;
    private Boolean isPregnant;
    private String routineTime;
}
