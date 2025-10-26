package com.zolty.app.repository;

import com.zolty.app.model.RuleIngredient;
import com.zolty.app.model.RuleIngredientId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RuleIngredientRepository extends JpaRepository<RuleIngredient, RuleIngredientId> {
}
