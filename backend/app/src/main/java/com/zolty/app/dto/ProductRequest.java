package com.zolty.app.dto;

import lombok.*;
import java.util.Set;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private String name;
    private String brand;
    private String category;


    private Set<String> skinTypes;

    private String description;


    private String targetSex;
    private String targetAgeGroup;

    private Boolean isVegan;
    private Boolean isCrueltyFree;
    private Boolean isEcoCertified;
    private Boolean notRecommendedDuringPregnancy;

    private String useTime;


    private Set<String> ingredients;
    private Set<String> goals;
    private List<Long> ingredientIds;
    private List<Long> goalIds;
}
