package com.zolty.app.mapper;

import com.zolty.app.dto.GoalRequest;
import com.zolty.app.dto.GoalResponse;
import com.zolty.app.model.Goal;
import org.springframework.stereotype.Component;

@Component
public class GoalMapper {

    public Goal toEntity(GoalRequest request) {
        Goal goal = new Goal();
        goal.setName(request.getName());
        return goal;
    }

    public GoalResponse toDto(Goal entity) {
        return GoalResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .build();
    }
}
