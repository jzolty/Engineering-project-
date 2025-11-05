package com.zolty.app.repository;

import com.zolty.app.model.SkincarePlanProduct;
import com.zolty.app.model.SkincarePlanProductId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkincarePlanProductRepository extends JpaRepository<SkincarePlanProduct, SkincarePlanProductId> {

    // wszystkie produkty dla danego planu
    List<SkincarePlanProduct> findBySkincarePlan_Id(Long planId);

    // usuń wszystkie produkty z planu (np. przy aktualizacji)
    void deleteBySkincarePlan_Id(Long planId);
}
