package com.zolty.app.repository;

import com.zolty.app.model.Have;
import com.zolty.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HaveRepository extends JpaRepository<Have, Long> {

    // znajdź relacje użytkownika
    List<Have> findByUser(User user);

    // znajdź relację po analizie skóry
    Have findBySkinAnalysis_Id(Long skinAnalysisId);

    // znajdź relację po planie pielęgnacyjnym
    List<Have> findBySkincarePlan_Id(Long skincarePlanId);




}
