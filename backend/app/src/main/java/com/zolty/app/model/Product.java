package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;

    @Enumerated(EnumType.STRING)
    private Category category;

    //private String skinType;
    private String description;

    @Enumerated(EnumType.STRING)
    private Sex targetSex;

    @Enumerated(EnumType.STRING)
    private AgeGroup targetAgeGroup;

    private Boolean isVegan;
    private Boolean isCrueltyFree;
    private Boolean isEcoCertified;
    private Boolean notRecommendedDuringPregnancy;

    @Enumerated(EnumType.STRING)
    private UseTime useTime;

    // --- RELACJE ---
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductIngredient> productIngredients = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductGoal> productGoals = new HashSet<>();

    @ElementCollection(targetClass = SkinType.class)
    @CollectionTable(name = "product_skin_types", joinColumns = @JoinColumn(name = "product_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "skin_type")
    private Set<SkinType> skinTypes = new HashSet<>();

}
