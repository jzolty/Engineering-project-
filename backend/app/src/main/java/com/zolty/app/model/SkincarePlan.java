package com.zolty.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "skincare_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkincarePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // użytkownik, który utworzył plan
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // relacja z have (1:N)
    @OneToMany(mappedBy = "skincarePlan", cascade = CascadeType.ALL)
    private Set<Have> haveRelations;

    private String name;
    private String source;           // AUTO lub MANUAL (typ utworzenia)
    @Enumerated(EnumType.STRING)
    private UseTime routineTime;     // np. MORNING / EVENING
    private String note;             // notatka użytkownika

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // relacja N:M z produktami przez tabelę pośrednią
    @OneToMany(mappedBy = "skincarePlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkincarePlanProduct> skincarePlanProducts;
}
