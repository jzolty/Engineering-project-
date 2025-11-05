package com.zolty.app.repository;

import com.zolty.app.model.SkinAnalysis;
import com.zolty.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkinAnalysisRepository extends JpaRepository<SkinAnalysis, Long> {

    // wszystkie analizy użytkownika
    List<SkinAnalysis> findByHave_User(User user);

    // jedna analiza powiązana przez "have"
    Optional<SkinAnalysis> findByHave_Id(Long haveId);

    // opcjonalnie: ostatnia analiza użytkownika (np. do rekomendacji)
    Optional<SkinAnalysis> findTopByHave_UserOrderByIdDesc(User user);
}
