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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class SkinAnalysisService {

    private final SkinAnalysisRepository skinAnalysisRepository;
    private final HaveRepository haveRepository;
    private final UserRepository userRepository;
    private final SkincarePlanRepository skincarePlanRepository;
    private final SkinAnalysisMapper skinAnalysisMapper;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Zapis nowej analizy skóry użytkownika
     */
    @Transactional
    public SkinAnalysisResponse saveAnalysis(Long userId, SkinAnalysisRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        log.info(" Tworzenie analizy skóry dla userId={} z danymi: {}", userId, request);

        // Tworzymy i zapisujemy analizę
        SkinAnalysis analysis = skinAnalysisMapper.toEntity(request);
        SkinAnalysis savedAnalysis = skinAnalysisRepository.saveAndFlush(analysis);

        // Pobieramy ponownie jako „managed” encję
        SkinAnalysis managedAnalysis = skinAnalysisRepository.findById(savedAnalysis.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Nie znaleziono zapisanej analizy"));

        // Tworzymy Have — bez kaskadowego zapisu analizy
        Have have = Have.builder()
                .skinAnalysis(managedAnalysis)
                .user(user)
                .skincarePlan(null)
                .build();

        haveRepository.saveAndFlush(have);

        log.info(" Zapisano analizę (id={}) i powiązanie Have dla usera {}", savedAnalysis.getId(), userId);
        return skinAnalysisMapper.toDto(managedAnalysis);
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
