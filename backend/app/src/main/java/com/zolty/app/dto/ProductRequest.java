package com.zolty.app.dto;

import com.zolty.app.model.UseTime;
import lombok.*;
import java.util.Set;
import java.util.List;
import com.zolty.app.model.Category;

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
    private List<Long> ingredientIds;
    private List<Long> goalIds;

}
