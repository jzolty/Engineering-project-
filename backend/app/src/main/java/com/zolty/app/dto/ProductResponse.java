package com.zolty.app.dto;

import com.zolty.app.model.UseTime;
import lombok.Builder;
import lombok.*;

import java.util.List;

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
    private String skinType;
    private String description;
    private String targetSex;
    private String targetAgeGroup;

    private Boolean isVegan;
    private Boolean isCrueltyFree;
    private Boolean isEcoCertified;
    private Boolean notRecommendedDuringPregnancy;

    private UseTime useTime;

    private List<String> ingredients;
    private List<String> goals;
}
