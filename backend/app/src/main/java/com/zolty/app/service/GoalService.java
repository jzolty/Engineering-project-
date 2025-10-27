package com.zolty.app.service;

import com.zolty.app.dto.GoalRequest;
import com.zolty.app.dto.GoalResponse;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.mapper.GoalMapper;
import com.zolty.app.model.Goal;
import com.zolty.app.repository.GoalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final GoalMapper goalMapper;

    public List<GoalResponse> getAllGoals() {
        return goalRepository.findAll()
                .stream()
                .map(goalMapper::toDto)
                .collect(Collectors.toList());
    }

    public GoalResponse getGoalById(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        return goalMapper.toDto(goal);
    }

    @Transactional
    public GoalResponse addGoal(GoalRequest request) {
        Goal goal = goalMapper.toEntity(request);
        goalRepository.save(goal);
        return goalMapper.toDto(goal);
    }

    @Transactional
    public GoalResponse updateGoal(Long id, GoalRequest request) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));

        goal.setName(request.getName());
        goalRepository.save(goal);

        return goalMapper.toDto(goal);
    }

    @Transactional
    public void deleteGoal(Long id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
        goalRepository.delete(goal);
    }
}
