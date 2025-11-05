package com.zolty.app.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HaveResponse {

    private Long id;                 // = skin_analysis_id (PK)
    private Long userId;             // użytkownik, do którego należy analiza i plan
    private Long skincarePlanId;     // przypisany plan pielęgnacji
    private Long skinAnalysisId;     // przypisana analiza skóry

    private String skincarePlanName;
    private String routineTime;
}
