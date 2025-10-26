package com.zolty.app.controller;

import com.zolty.app.dto.IngredientRequest;
import com.zolty.app.dto.IngredientResponse;
import com.zolty.app.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping
    public ResponseEntity<IngredientResponse> addIngredient(@RequestBody IngredientRequest request) {
        return ResponseEntity.ok(ingredientService.addIngredient(request));
    }

    @GetMapping
    public ResponseEntity<List<IngredientResponse>> getAllIngredients() {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }
}
