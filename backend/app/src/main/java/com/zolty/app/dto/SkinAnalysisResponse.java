package com.zolty.app.dto;

import lombok.*;
import java.util.Set;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkinAnalysisResponse {

    private Long id;

    private String sex;
    private Set<String> skinTypes;
    private List<String> goals;
    private String avoidIngredients;

    private Boolean veganPreference;
    private Boolean crueltyFreePreference;
    private Boolean ecoPreference;
    private String ageGroup;
    private Boolean isPregnant;
    private String routineTime;


}
