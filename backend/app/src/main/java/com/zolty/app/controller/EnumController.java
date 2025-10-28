package com.zolty.app.controller;

import com.zolty.app.model.*;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/enums")
public class EnumController {
    @PreAuthorize("permitAll()")

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(
                Arrays.stream(Category.values())
                        .map(Enum::name)
                        .toList()
        );
    }
    @PreAuthorize("permitAll()")

    @GetMapping("/use-times")
    public ResponseEntity<List<String>> getUseTimes() {
        return ResponseEntity.ok(
                Arrays.stream(UseTime.values())
                        .map(Enum::name)
                        .toList()
        );
    }
    @PreAuthorize("permitAll()")

    @GetMapping("/skin-types")
    public ResponseEntity<List<String>> getSkinTypes() {
        return ResponseEntity.ok(
                Arrays.stream(SkinType.values())
                        .map(Enum::name)
                        .toList()
        );
    }
    @PreAuthorize("permitAll()")

    @GetMapping("/target-sexes")
    public ResponseEntity<List<String>> getTargetSexes() {
        return ResponseEntity.ok(
                Arrays.stream(Sex.values())
                        .map(Enum::name)
                        .toList()
        );
    }

    @PreAuthorize("permitAll()")

    @GetMapping("/age-groups")
    public ResponseEntity<List<String>> getAgeGroups() {
        return ResponseEntity.ok(
                Arrays.stream(AgeGroup.values())
                        .map(Enum::name)
                        .toList()
        );
    }





}
