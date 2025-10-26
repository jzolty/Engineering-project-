package com.zolty.app.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GoalResponse {
    private Long id;
    private String name;
}
