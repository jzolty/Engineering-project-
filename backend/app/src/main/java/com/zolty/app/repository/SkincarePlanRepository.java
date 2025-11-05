package com.zolty.app.repository;

import com.zolty.app.model.SkincarePlan;
import com.zolty.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkincarePlanRepository extends JpaRepository<SkincarePlan, Long> {

    // wszystkie plany danego użytkownika
    List<SkincarePlan> findByUser(User user);

    // wyszukiwanie po nazwie (np. dla walidacji duplikatów)
    boolean existsByUserAndName(User user, String name);
}
