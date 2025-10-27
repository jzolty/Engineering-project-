package com.zolty.app.repository;

import com.zolty.app.model.ProductGoal;
import com.zolty.app.model.ProductGoalId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductGoalRepository extends JpaRepository<ProductGoal, ProductGoalId> {

    @Transactional
    void deleteByProductId(Long productId);
}
