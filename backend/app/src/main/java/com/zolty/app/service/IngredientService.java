package com.zolty.app.service;

import com.zolty.app.dto.IngredientRequest;
import com.zolty.app.dto.IngredientResponse;
import com.zolty.app.exception.BadRequestException;
import com.zolty.app.exception.ConflictException;
import com.zolty.app.exception.ResourceNotFoundException;
import com.zolty.app.mapper.IngredientMapper;
import com.zolty.app.model.Ingredient;
import com.zolty.app.repository.IngredientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public List<IngredientResponse> getAllIngredients() {
        return ingredientRepository.findAll()
                .stream()
                .map(ingredientMapper::toDto)
                .collect(Collectors.toList());
    }

    public IngredientResponse getIngredientById(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
        return ingredientMapper.toDto(ingredient);
    }

    @Transactional
    public IngredientResponse addIngredient(IngredientRequest request) {
        //  Walidacja
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Nazwa składnika nie może być pusta");
        }

        //  Normalizacja nazwy (np. aqua → Aqua)
        String normalizedName = normalizeName(request.getName());

        //  Sprawdzenie, czy taki składnik już istnieje (niezależnie od wielkości liter)
        Optional<Ingredient> existing = ingredientRepository.findByNameIgnoreCase(normalizedName);
        if (existing.isPresent()) {
            throw new ConflictException("Składnik o tej nazwie już istnieje: " + normalizedName);
        }

        // Mapowanie i zapis
        Ingredient ingredient = ingredientMapper.toEntity(request);
        ingredient.setName(normalizedName); // nadpisujemy ujednoliconą nazwą
        ingredientRepository.save(ingredient);

        //  Zwrot DTO
        return ingredientMapper.toDto(ingredient);
    }

    //  Metoda pomocnicza do normalizacji nazw
    private String normalizeName(String name) {
        if (name == null || name.isBlank()) return name;
        name = name.trim().toLowerCase();
        return Character.toUpperCase(name.charAt(0)) + name.substring(1);
    }


    @Transactional
    public IngredientResponse updateIngredient(Long id, IngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));

        ingredient.setName(request.getName());
        ingredientRepository.save(ingredient);

        return ingredientMapper.toDto(ingredient);
    }

    @Transactional
    public void deleteIngredient(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
        ingredientRepository.delete(ingredient);
    }
}
