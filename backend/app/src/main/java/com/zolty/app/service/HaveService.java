package com.zolty.app.service;

import com.zolty.app.dto.HaveResponse;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.model.*;
import com.zolty.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HaveService {

    private final HaveRepository haveRepository;
    private final UserRepository userRepository;
    private final SkinAnalysisRepository skinAnalysisRepository;
    private final SkincarePlanRepository skincarePlanRepository;

    /**
     * Tworzy powiązanie między użytkownikiem, analizą i planem
     */
    public HaveResponse createRelation(Long userId, Long skinAnalysisId, Long skincarePlanId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        SkinAnalysis analysis = skinAnalysisRepository.findById(skinAnalysisId)
                .orElseThrow(() -> new ResourceNotFoundException("SkinAnalysis not found with id " + skinAnalysisId));

        SkincarePlan plan = skincarePlanRepository.findById(skincarePlanId)
                .orElseThrow(() -> new ResourceNotFoundException("SkincarePlan not found with id " + skincarePlanId));

        Have have = Have.builder()
                .user(user)
                .skinAnalysis(analysis)
                .skincarePlan(plan)
                .build();

        Have saved = haveRepository.save(have);

        return toResponse(saved);
    }

    /**
     * Pobiera wszystkie relacje użytkownika
     */
    public List<HaveResponse> getRelationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        return haveRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private HaveResponse toResponse(Have have) {
        return HaveResponse.builder()
                .id(have.getId())
                .userId(have.getUser().getId())
                .skinAnalysisId(have.getSkinAnalysis().getId())
                .skincarePlanId(have.getSkincarePlan().getId())
                .skincarePlanName(have.getSkincarePlan().getName())
                .routineTime(have.getSkincarePlan().getRoutineTime() != null
                        ? have.getSkincarePlan().getRoutineTime().name() : null)
                .build();
    }
}
