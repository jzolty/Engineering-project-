package com.zolty.app.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkincarePlanResponse {

    private Long id;
    private String name;
    private String note;
    private String source;
    private String routineTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    //private List<Map<String, Object>> products;
    private List<SkincarePlanProductResponse> products;


    private Map<String, Object> user;
}
