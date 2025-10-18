import React, { useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "../../assets/styles/Account.css";
import "./AddProduct.css";

const AddProduct = () => {
    // przykładowe dane celów
    const [goals, setGoals] = useState([
        { id: 1, name: "Przebarwienia" },
        { id: 2, name: "Nawilżenie" },
        { id: 3, name: "Bariera ochronna skóry" },
    ]);

    // przykładowe dane składników (INCI)
    const [ingredients, setIngredients] = useState([
        { id: 1, name: "Aqua / Water" },
        { id: 2, name: "Glycerin" },
        { id: 3, name: "Cetearyl Alcohol" },
        { id: 4, name: "Caprylic/Capric Triglyceride" },
        { id: 5, name: "Ceramide NP" },
        { id: 6, name: "Ceramide AP" },
        { id: 7, name: "Ceramide EOP" },
        { id: 8, name: "Hyaluronic Acid" },
        { id: 9, name: "Cholesterol" },
        { id: 10, name: "Dimethicone" },
    ]);

    const [selectedGoals, setSelectedGoals] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const [ingredientSearch, setIngredientSearch] = useState("");
    const [newIngredient, setNewIngredient] = useState("");
    const [newGoal, setNewGoal] = useState("");

    const handleGoalToggle = (id) => {
        setSelectedGoals((prev) =>
            prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
        );
    };

    // dodawanie nowego celu
    const handleAddGoal = () => {
        if (newGoal.trim() !== "") {
            setGoals([...goals, { id: goals.length + 1, name: newGoal }]);
            setNewGoal("");
        }
    };

    // dodawanie nowego składnika
    const handleAddIngredient = () => {
        if (newIngredient.trim() !== "") {
            setIngredients([
                ...ingredients,
                { id: ingredients.length + 1, name: newIngredient },
            ]);
            setNewIngredient("");
        }
    };

    // obsługa dodawania składnika z listy
    const handleIngredientSelect = (id) => {
        if (!selectedIngredients.includes(id)) {
            setSelectedIngredients([...selectedIngredients, id]);
        }
    };

    // filtrowanie listy składników po wpisanym tekście
    const filteredIngredients = ingredients.filter((i) =>
        i.name.toLowerCase().includes(ingredientSearch.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            name: e.target.name.value,
            brand: e.target.brand.value,
            category: e.target.category.value,
            description: e.target.description.value,
            selectedGoals,
            selectedIngredients,
        };
        console.log("Nowy produkt:", newProduct);
        alert("Produkt zapisany na razie tylko w konsoli dla testów");
    };

    return (
        <div className="add-product-page">
            <AdminNavbar />

            <div className="add-product-container">
                <h2>Dodaj nowy produkt</h2>

                <form className="add-product-form" onSubmit={handleSubmit}>
                    <label>Nazwa produktu</label>
                    <input type="text" name="name" placeholder="Wpisz nazwę..." required />

                    <label>Marka</label>
                    <input type="text" name="brand" placeholder="Wpisz markę..." required />

                    <label>Kategoria</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Np. cleanser, serum..."
                        required
                    />

                    <label>Opis</label>
                    <textarea
                        name="description"
                        placeholder="Krótki opis produktu..."
                    />

                    {/* === Składniki === */}
                    <h3>Składniki (INCI)</h3>
                    <p className="hint">Wybierz lub dodaj składniki występujące w produkcie.</p>

                    <div className="ingredient-select">
                        <input
                            type="text"
                            placeholder="Szukaj składnika..."
                            value={ingredientSearch}
                            onChange={(e) => setIngredientSearch(e.target.value)}
                        />
                        {ingredientSearch && (
                            <div className="ingredient-dropdown">
                                {filteredIngredients.length > 0 ? (
                                    filteredIngredients.map((i) => (
                                        <div
                                            key={i.id}
                                            className="dropdown-item"
                                            onClick={() => handleIngredientSelect(i.id)}
                                        >
                                            {i.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="dropdown-empty">Brak wyników</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Lista wybranych składników */}
                    <div className="selected-ingredients">
                        {selectedIngredients.map((id) => {
                            const ing = ingredients.find((i) => i.id === id);
                            return (
                                <span key={id} className="ingredient-tag">
                                    {ing ? ing.name : "?"}
                                </span>
                            );
                        })}
                    </div>

                    {/* Dodawanie nowego składnika */}
                    <div className="add-inline">
                        <input
                            type="text"
                            placeholder="Dodaj nowy składnik..."
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                        />
                        <button type="button" onClick={handleAddIngredient}>
                            ➕ Dodaj
                        </button>
                    </div>

                    {/* === Cele === */}
                    <h3>Cele produktu</h3>
                    <div className="multi-select">
                        {goals.map((g) => (
                            <label key={g.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    checked={selectedGoals.includes(g.id)}
                                    onChange={() => handleGoalToggle(g.id)}
                                />
                                {g.name}
                            </label>
                        ))}
                    </div>

                    <div className="add-inline">
                        <input
                            type="text"
                            placeholder="Dodaj nowy cel..."
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                        />
                        <button type="button" onClick={handleAddGoal}>
                            ➕ Dodaj
                        </button>
                    </div>

                    <button type="submit" className="save-btn">
                        💾 Zapisz produkt
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
