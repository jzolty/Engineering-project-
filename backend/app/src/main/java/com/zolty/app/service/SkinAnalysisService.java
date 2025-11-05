package com.zolty.app.service;

import com.zolty.app.dto.SkinAnalysisRequest;
import com.zolty.app.dto.SkinAnalysisResponse;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.mapper.SkinAnalysisMapper;
import com.zolty.app.model.*;
import com.zolty.app.repository.HaveRepository;
import com.zolty.app.repository.SkinAnalysisRepository;
import com.zolty.app.repository.SkincarePlanRepository;
import com.zolty.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkinAnalysisService {

    private final SkinAnalysisRepository skinAnalysisRepository;
    private final HaveRepository haveRepository;
    private final UserRepository userRepository;
    private final SkincarePlanRepository skincarePlanRepository;
    private final SkinAnalysisMapper skinAnalysisMapper;

    /**
     * Zapis nowej analizy skóry użytkownika
     */
    @Transactional
    public SkinAnalysisResponse saveAnalysis(Long userId, SkinAnalysisRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        //  Tworzymy encję SkinAnalysis z mappera
        SkinAnalysis analysis = skinAnalysisMapper.toEntity(request);
        skinAnalysisRepository.save(analysis);

        //  Tworzymy relację w tabeli "have"
        Have have = Have.builder()
                .skinAnalysis(analysis)
                .user(user)
                .skincarePlan(null) // plan zostanie utworzony później przez algorytm
                .build();
        haveRepository.save(have);

        return skinAnalysisMapper.toDto(analysis);
    }

    /**
     * Pobranie wszystkich analiz danego użytkownika
     */
    public List<SkinAnalysisResponse> getUserAnalyses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return skinAnalysisRepository.findByHave_User(user).stream()
                .map(skinAnalysisMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Pobranie jednej analizy po ID
     */
    public SkinAnalysisResponse getById(Long id) {
        SkinAnalysis analysis = skinAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skin analysis not found with id: " + id));
        return skinAnalysisMapper.toDto(analysis);
    }
}
