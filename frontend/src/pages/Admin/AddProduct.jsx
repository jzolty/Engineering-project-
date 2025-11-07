import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/AdminNavbar";
import Select from "react-select";
import productService from "../../services/productService";
import enumService from "../../services/enumService";
import ingredientService from "../../services/ingredientService";
import goalService from "../../services/goalService";
import "./AddEditProduct.css";

const translations = {
    MORNING: "Poranna",
    EVENING: "Wieczorna",
    ANY: "Dowolna",

    FEMALE: "Kobieta",
    MALE: "Mężczyzna",
    ALLSEX: "Dowolna płeć",

    TEEN: "Nastolatek",
    YOUNG_ADULT: "Młody dorosły",
    ADULT: "Dorosły",
    MATURE: "Dojrzała",
    ALL: "Każdy wiek",

    DRY: "Sucha",
    OILY: "Tłusta",
    SENSITIVE: "Wrażliwa",
    COMBINATION: "Mieszana",
    NORMAL: "Normalna",
    MATURE_SKIN: "Dojrzała skóra",

    CREAM: "Krem",
    SERUM: "Serum",
    TONER: "Tonik",
    SPF: "Filtr przeciwsłoneczny",
    CLEANSER: "Preparat oczyszczający",
    MASK: "Maseczka",
    MICELLAR_WATER: "Płyn micelarny",
    EYE_CREAM: "Krem pod oczy",
    OTHER: "Inny",
};

const AddProduct = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        brand: "",
        category: "",
        skinTypes: [],
        description: "",
        targetSex: "",
        targetAgeGroup: "",
        isVegan: false,
        isCrueltyFree: false,
        isEcoCertified: false,
        notRecommendedDuringPregnancy: false,
        useTime: "",
        ingredientIds: [],
        ingredientNames: [],
        goalIds: [],
    });

    const [enums, setEnums] = useState({
        categories: [],
        skinTypes: [],
        targetSexes: [],
        ageGroups: [],
        useTimes: [],
    });

    const [ingredients, setIngredients] = useState([]);
    const [goals, setGoals] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [newGoal, setNewGoal] = useState("");
    const [ingredientInput, setIngredientInput] = useState(""); // 🆕 INCI text area
    const [errors, setErrors] = useState({});

    useEffect(() => {
        Promise.all([
            enumService.getCategories(),
            enumService.getSkinTypes(),
            enumService.getTargetSexes(),
            enumService.getAgeGroups(),
            enumService.getUseTimes(),
            ingredientService.getAllIngredients(),
            goalService.getAllGoals(),
        ])
            .then(
                ([
                     categories,
                     skinTypes,
                     targetSexes,
                     ageGroups,
                     useTimes,
                     ingredientsRes,
                     goalsRes,
                 ]) => {
                    setEnums({
                        categories: categories.data,
                        skinTypes: skinTypes.data,
                        targetSexes: targetSexes.data,
                        ageGroups: ageGroups.data,
                        useTimes: useTimes.data,
                    });
                    setIngredients(ingredientsRes.data);
                    setGoals(goalsRes.data);
                }
            )
            .catch((err) => console.error("Błąd ładowania danych:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddNew = async (type) => {
        try {
            if (type === "ingredient" && newIngredient.trim() !== "") {
                const res = await ingredientService.addIngredient({ name: newIngredient });
                setIngredients((prev) => [...prev, res.data]);
                setNewIngredient("");
                alert(`Dodano nowy składnik: ${res.data.name}`);
            }

            if (type === "goal" && newGoal.trim() !== "") {
                const res = await goalService.addGoal({ name: newGoal });
                setGoals((prev) => [...prev, res.data]);
                setNewGoal("");
                alert(`Dodano nowy cel: ${res.data.name}`);
            }
        } catch (err) {
            console.error("Błąd przy dodawaniu:", err);
            if (err.response && err.response.data && err.response.data.message) {
                alert(`${err.response.data.message}`);
            } else {
                alert("Nie udało się dodać składnika/celu. Spróbuj ponownie.");
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Nazwa jest wymagana.";
        if (!form.brand.trim()) newErrors.brand = "Marka jest wymagana.";
        if (!form.category) newErrors.category = "Wybierz kategorię.";
        if (!form.targetSex) newErrors.targetSex = "Wybierz płeć docelową.";
        if (!form.useTime) newErrors.useTime = "Wybierz porę dnia.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const payload = { ...form };

        //  jeśli użytkownik wkleił skład INCI — używamy ingredientNames
        if (form.ingredientNames && form.ingredientNames.length > 0) {
            delete payload.ingredientIds;
        } else if (form.ingredientIds.length > 0) {
            delete payload.ingredientNames;
        }

        try {
            await productService.addProduct(payload);
            alert("Produkt został dodany pomyślnie!");
            navigate("/admin/manage-products");
        } catch (err) {
            console.error("Błąd dodawania produktu:", err);
            alert("Nie udało się dodać produktu.");
        }
    };

    //  funkcja do parsowania INCI po przecinku
    const parseINCI = () => {
        const parsed = ingredientInput
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i.length > 0);
        setForm((prev) => ({
            ...prev,
            ingredientNames: parsed,
        }));
        alert(`Dodano ${parsed.length} składników do listy.`);
    };

    return (
        <div className="add-edit-product">
            <Navbar role="admin" />
            <div className="form-container">
                <h1>Dodaj nowy produkt</h1>

                <form onSubmit={handleSubmit} className="product-form">
                    <label>Nazwa *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <p className="error">{errors.name}</p>}

                    <label>Marka *</label>
                    <input type="text" name="brand" value={form.brand} onChange={handleChange} />
                    {errors.brand && <p className="error">{errors.brand}</p>}

                    <label>Kategoria *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                        <option value="">-- wybierz --</option>
                        {enums.categories.map((c) => (
                            <option key={c} value={c}>
                                {translations[c] || c}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="error">{errors.category}</p>}

                    <label>Typy skóry</label>
                    <Select
                        isMulti
                        name="skinTypes"
                        options={enums.skinTypes.map((t) => ({
                            value: t,
                            label: translations[t] || t,
                        }))}
                        value={enums.skinTypes
                            .filter((t) => form.skinTypes.includes(t))
                            .map((t) => ({ value: t, label: translations[t] || t }))}
                        onChange={(selected) =>
                            setForm((prev) => ({
                                ...prev,
                                skinTypes: selected.map((opt) => opt.value),
                            }))
                        }
                        placeholder="Wybierz typy skóry..."
                        className="custom-select"
                        classNamePrefix="select"
                    />

                    <label>Opis</label>
                    <textarea name="description" value={form.description} onChange={handleChange} />

                    <label>Płeć docelowa *</label>
                    <select name="targetSex" value={form.targetSex} onChange={handleChange}>
                        <option value="">-- wybierz --</option>
                        {enums.targetSexes.map((s) => (
                            <option key={s} value={s}>
                                {translations[s] || s}
                            </option>
                        ))}
                    </select>
                    {errors.targetSex && <p className="error">{errors.targetSex}</p>}

                    <label>Grupa wiekowa</label>
                    <select
                        name="targetAgeGroup"
                        value={form.targetAgeGroup}
                        onChange={handleChange}
                    >
                        <option value="">-- wybierz --</option>
                        {enums.ageGroups.map((a) => (
                            <option key={a} value={a}>
                                {translations[a] || a}
                            </option>
                        ))}
                    </select>

                    <label>Pora dnia *</label>
                    <select name="useTime" value={form.useTime} onChange={handleChange}>
                        <option value="">-- wybierz --</option>
                        {enums.useTimes.map((u) => (
                            <option key={u} value={u}>
                                {translations[u] || u}
                            </option>
                        ))}
                    </select>
                    {errors.useTime && <p className="error">{errors.useTime}</p>}

                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="isVegan"
                                checked={form.isVegan}
                                onChange={handleChange}
                            />
                            Wegański
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="isCrueltyFree"
                                checked={form.isCrueltyFree}
                                onChange={handleChange}
                            />
                            Cruelty-free
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="isEcoCertified"
                                checked={form.isEcoCertified}
                                onChange={handleChange}
                            />
                            Eko
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="notRecommendedDuringPregnancy"
                                checked={form.notRecommendedDuringPregnancy}
                                onChange={handleChange}
                            />
                            Nie zalecany w ciąży
                        </label>
                    </div>

                    {/*  SEKCJA — Wklej INCI */}
                    <h3>Skład (INCI)</h3>
                    <label>Lub wklej skład INCI po przecinku:</label>
                    <textarea
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        placeholder="Np. Aqua, Glycerin, Niacinamide, Panthenol..."
                        rows={4}
                    />
                    <button type="button" className="parse-btn" onClick={parseINCI}>
                        Przetwórz skład INCI
                    </button>

                    <p style={{ fontSize: "0.9em", color: "#666", marginTop: "6px" }}>
                        Możesz też wybrać składniki z listy poniżej ⬇️
                    </p>

                    <Select
                        isMulti
                        name="ingredientIds"
                        options={ingredients.map((i) => ({
                            value: i.id,
                            label: i.name,
                        }))}
                        value={ingredients
                            .filter((i) => form.ingredientIds.includes(i.id))
                            .map((i) => ({ value: i.id, label: i.name }))}
                        onChange={(selected) =>
                            setForm((prev) => ({
                                ...prev,
                                ingredientIds: selected.map((opt) => opt.value),
                            }))
                        }
                        placeholder="Wybierz składniki..."
                        className="custom-select"
                        classNamePrefix="select"
                    />

                    <div className="add-inline">
                        <input
                            type="text"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                            placeholder="Nowy składnik"
                        />
                        <button type="button" onClick={() => handleAddNew("ingredient")}>
                            + Dodaj składnik
                        </button>
                    </div>

                    <h3>Efekty działania (Goals)</h3>
                    <Select
                        isMulti
                        name="goalIds"
                        options={goals.map((g) => ({
                            value: g.id,
                            label: g.name,
                        }))}
                        value={goals
                            .filter((g) => form.goalIds.includes(g.id))
                            .map((g) => ({ value: g.id, label: g.name }))}
                        onChange={(selected) =>
                            setForm((prev) => ({
                                ...prev,
                                goalIds: selected.map((opt) => opt.value),
                            }))
                        }
                        placeholder="Wybierz efekty działania..."
                        className="custom-select"
                        classNamePrefix="select"
                    />

                    <div className="add-inline">
                        <input
                            type="text"
                            value={newGoal}
                            onChange={(e) => setNewGoal(e.target.value)}
                            placeholder="Nowy cel"
                        />
                        <button type="button" onClick={() => handleAddNew("goal")}>
                            + Dodaj cel
                        </button>
                    </div>

                    <button type="submit" className="save-btn">
                        Zapisz produkt
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
