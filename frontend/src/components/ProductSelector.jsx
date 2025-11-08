import React from "react";
import "./ProductSelector.css";

const ProductSelector = ({
                             showFiltersOnly = false,
                             filters,
                             onFilterChange,
                         }) => {
    return (
        <div className="filters-panel">
            <input
                type="text"
                name="name"
                placeholder="Nazwa produktu"
                value={filters.name}
                onChange={onFilterChange}
            />
            <input
                type="text"
                name="brand"
                placeholder="Marka"
                value={filters.brand}
                onChange={onFilterChange}
            />

            <label>Kategoria</label>
            <select
                name="category"
                value={filters.category}
                onChange={onFilterChange}
            >
                <option value="">Wszystkie</option>
                <option value="CREAM">Krem</option>
                <option value="SERUM">Serum</option>
                <option value="TONER">Tonik</option>
                <option value="MASK">Maska</option>
                <option value="SPF">Krem SPF</option>
                <option value="MICELLAR_WATER">Płyn micelarny</option>
                <option value="EYE_CREAM">Krem pod oczy</option>
                <option value="OTHER">Inne</option>
            </select>

            <label>Pora dnia</label>
            <select
                name="use_time"
                value={filters.use_time}
                onChange={onFilterChange}
            >
                <option value="">Wszystkie</option>
                <option value="MORNING">Poranna</option>
                <option value="EVENING">Wieczorna</option>
                <option value="ANY">Dowolna</option>
            </select>

            <label>Dla kogo</label>
            <select
                name="target_sex"
                value={filters.target_sex}
                onChange={onFilterChange}
            >
                <option value="">Wszystkie</option>
                <option value="FEMALE">Kobieta</option>
                <option value="MALE">Mężczyzna</option>
                <option value="ALL">Unisex</option>
            </select>

            <div className="radio-section">
                {[
                    { name: "is_vegan", label: "Wegański" },
                    { name: "is_cruelty_free", label: "Cruelty-free" },
                    { name: "is_eco_certified", label: "Eko" },
                ].map((filter) => (
                    <div key={filter.name} className="radio-group">
                        <label className="radio-title">{filter.label}</label>
                        <div className="radio-options">
                            <label>
                                <input
                                    type="radio"
                                    name={filter.name}
                                    value="true"
                                    checked={filters[filter.name] === "true"}
                                    onChange={onFilterChange}
                                />
                                <span className="icon-true">✓</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name={filter.name}
                                    value="false"
                                    checked={filters[filter.name] === "false"}
                                    onChange={onFilterChange}
                                />
                                <span className="icon-false">✗</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name={filter.name}
                                    value=""
                                    checked={filters[filter.name] === ""}
                                    onChange={onFilterChange}
                                />
                                <span className="icon-unknown">•</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSelector;
