package com.zolty.app.dto;

import lombok.Builder;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String category;


    private List<String> skinTypes;

    private String description;


    private String targetSex;
    private String targetAgeGroup;

    private Boolean isVegan;
    private Boolean isCrueltyFree;
    private Boolean isEcoCertified;
    private Boolean notRecommendedDuringPregnancy;

    private String useTime;

    private List<String> ingredients;
    private List<String> goals;
}
