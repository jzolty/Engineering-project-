package com.zolty.app.model;

import lombok.Getter;

@Getter
public enum RuleType {
    BENEFICIAL("Korzyść"),
    CONFLICT("Konflikt");

    private final String displayName;

    RuleType(String displayName) {
        this.displayName = displayName;
    }
}
