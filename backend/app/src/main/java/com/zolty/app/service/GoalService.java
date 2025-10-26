package com.zolty.app.service;

import com.zolty.app.dto.GoalRequest;
import com.zolty.app.dto.GoalResponse;
import com.zolty.app.mapper.GoalMapper;
import com.zolty.app.model.Goal;
import com.zolty.app.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final GoalMapper goalMapper;

    public GoalResponse addGoal(GoalRequest request) {
        Goal goal = goalMapper.toEntity(request);
        goalRepository.save(goal);
        return goalMapper.toDto(goal);
    }

    public List<GoalResponse> getAllGoals() {
        return goalRepository.findAll()
                .stream()
                .map(goalMapper::toDto)
                .collect(Collectors.toList());
    }
}
