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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "skin_analysis_id", nullable = false, unique = true)
    private SkinAnalysis skinAnalysis;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "skincare_plan_id", nullable = true)
    private SkincarePlan skincarePlan;
}

