package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "skin_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkinAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    // powiązanie z have (1:N)
    @OneToOne(mappedBy = "skinAnalysis", cascade = CascadeType.ALL)
    private Have have;


    // preferencje użytkownika
    //private String sex;
    @Enumerated(EnumType.STRING)
    private Sex sex;

    @ElementCollection(targetClass = SkinType.class)
    @CollectionTable(name = "skin_analysis_skin_types", joinColumns = @JoinColumn(name = "skin_analysis_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "skin_type")
    private Set<SkinType> skinTypes = new HashSet<>();

    private String avoidIngredients;

    @ManyToMany
    @JoinTable(
            name = "skin_analysis_goals",
            joinColumns = @JoinColumn(name = "skin_analysis_id"),
            inverseJoinColumns = @JoinColumn(name = "goal_id")
    )
    private Set<Goal> goals = new HashSet<>();


    private Boolean veganPreference;
    private Boolean crueltyFreePreference;
    private Boolean ecoPreference;

    @Enumerated(EnumType.STRING)
    private AgeGroup ageGroup;

    private Boolean isPregnant;

    @Enumerated(EnumType.STRING)
    private UseTime routineTime;

}
