package com.zolty.app.repository;

import com.zolty.app.model.ProductIngredient;
import com.zolty.app.model.ProductIngredientId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductIngredientRepository extends JpaRepository<ProductIngredient, ProductIngredientId> {

    @Transactional
    void deleteByProductId(Long productId);
}
