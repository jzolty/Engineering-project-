package com.zolty.app.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "have")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Have {

    // Klucz główny = FK do SkinAnalysis
    @Id
    @Column(name = "skin_analysis_id")
    private Long id;

    @OneToOne
    @MapsId // PK pochodzi z skinAnalysis.id
    @JoinColumn(name = "skin_analysis_id", nullable = false, unique = true)
    private SkinAnalysis skinAnalysis;

    // User (1) -> Have (N)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // SkincarePlan (1) -> Have (N)
    @ManyToOne
    @JoinColumn(name = "skincare_plan_id", nullable = false)
    private SkincarePlan skincarePlan;
}
