package com.zolty.app.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkincarePlanRequest {

    private String name;
    private String note;
    private String source;
    private String routineTime;

    private List<Long> productIds;
    private Long userId;
}
