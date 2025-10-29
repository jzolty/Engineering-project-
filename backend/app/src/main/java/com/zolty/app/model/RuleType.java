package com.zolty.app.model;

import lombok.Getter;

@Getter
public enum RuleType {
    BENEFICIAL("Korzyść"),
    HARMFUL("Szkodliwa interakcja"),
    SYNERGY("Synergia"),
    CONFLICT("Konflikt");

    private final String displayName;

    RuleType(String displayName) {
        this.displayName = displayName;
    }
}
