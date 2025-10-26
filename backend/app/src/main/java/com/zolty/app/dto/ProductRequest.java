package com.zolty.app.dto;

import com.zolty.app.model.UseTime;
import lombok.Data;
import java.util.Set;

@Data
public class ProductRequest {
    private String name;
    private String brand;
    private String category;
    private String skinType;
    private String description;
    private String targetSex;
    private String targetAgeGroup;

    private Boolean isVegan;
    private Boolean isCrueltyFree;
    private Boolean isEcoCertified;
    private Boolean notRecommendedDuringPregnancy;

    private UseTime useTime;

    private Set<String> ingredients; // nazwy składników
    private Set<String> goals;       // nazwy celów
}
