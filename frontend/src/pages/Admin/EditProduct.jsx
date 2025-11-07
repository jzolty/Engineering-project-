import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    ALLSEX:"Dowolna płeć",

    TEEN: "Nastolatek",
    YOUNG_ADULT: "Młody dorosły",
    ADULT: "Dorosły",
    MATURE: "Dojrzały",
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

const EditProduct = () => {
    const { id } = useParams();
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
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    //  Pobierz dane produktu i enumy
    useEffect(() => {
        const loadData = async () => {
            try {
                // 🔹 Pobierz wszystko na świeżo (unikamy starych ID)
                const [
                    productRes,
                    categories,
                    skinTypes,
                    targetSexes,
                    ageGroups,
                    useTimes,
                    ingredientsRes,
                    goalsRes,
                ] = await Promise.all([
                    productService.getProductById(id),
                    enumService.getCategories(),
                    enumService.getSkinTypes(),
                    enumService.getTargetSexes(),
                    enumService.getAgeGroups(),
                    enumService.getUseTimes(),
                    ingredientService.getAllIngredients(),
                    goalService.getAllGoals(),
                ]);

                const p = productRes.data;

                setForm({
                    name: p.name || "",
                    brand: p.brand || "",
                    category: p.category || "",
                    skinTypes: p.skinTypes || [],
                    description: p.description || "",
                    targetSex: p.targetSex || "",
                    targetAgeGroup: p.targetAgeGroup || "",
                    isVegan: p.isVegan || false,
                    isCrueltyFree: p.isCrueltyFree || false,
                    isEcoCertified: p.isEcoCertified || false,
                    notRecommendedDuringPregnancy: p.notRecommendedDuringPregnancy || false,
                    useTime: p.useTime || "",
                    ingredientIds: p.ingredients
                        ? p.ingredients
                            .filter((ing) => ing && ing.id != null)
                            .map((ing) => ing.id)
                        : [],
                    goalIds: p.goals
                        ? p.goals
                            .filter((goal) => goal && goal.id != null)
                            .map((goal) => goal.id)
                        : [],
                });

                setEnums({
                    categories: categories.data,
                    skinTypes: skinTypes.data,
                    targetSexes: targetSexes.data,
                    ageGroups: ageGroups.data,
                    useTimes: useTimes.data,
                });

                // 🔹 Zawsze świeża lista z backendu
                setIngredients(ingredientsRes.data);
                setGoals(goalsRes.data);
            } catch (err) {
                console.error(" Błąd ładowania danych produktu:", err);
                alert("Nie udało się załadować danych produktu.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔹 Walidacja pól wymaganych
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Nazwa produktu jest wymagana.";
        if (!form.brand.trim()) newErrors.brand = "Marka produktu jest wymagana.";
        if (!form.category) newErrors.category = "Wybierz kategorię.";
        if (!form.useTime) newErrors.useTime = "Wybierz porę dnia.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            alert("Uzupełnij wymagane pola.");
            return;
        }

        try {
            const formattedForm = {
                ...form,
                category: form.category?.toUpperCase() || null,
                targetSex: form.targetSex?.toUpperCase() || null,
                targetAgeGroup: form.targetAgeGroup?.toUpperCase() || null,
                useTime: form.useTime?.toUpperCase() || null,
                skinTypes: form.skinTypes ? form.skinTypes.map((t) => t.toUpperCase()) : [],
                ingredientIds: form.ingredientIds?.filter((id) => id != null) || [],
                goalIds: form.goalIds?.filter((id) => id != null) || [],
            };

            await productService.updateProduct(id, formattedForm);
            alert("Zmiany zostały zapisane pomyślnie!");
            navigate("/admin/manage-products");
        } catch (err) {
            console.error("Błąd aktualizacji produktu:", err);
            alert("Nie udało się zapisać zmian.");
        }
    };


    if (loading) return <p style={{ textAlign: "center" }}>Ładowanie danych...</p>;

    return (
        <div className="add-edit-product">
            <Navbar role="admin" />
            <div className="form-container">
                <h1>Edytuj produkt</h1>

                <form onSubmit={handleSubmit} className="product-form">
                    <label>Nazwa *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <label>Marka *</label>
                    <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                    />

                    <label>Kategoria *</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                    >
                        <option value="">-- wybierz --</option>
                        {enums.categories.map((c) => (
                            <option key={c} value={c}>
                                {translations[c] || c}
                            </option>
                        ))}
                    </select>

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
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <label>Płeć docelowa *</label>
                    <select
                        name="targetSex"
                        value={form.targetSex}
                        onChange={handleChange}
                    >
                        <option value="">-- wybierz --</option>
                        {enums.targetSexes.map((s) => (
                            <option key={s} value={s}>
                                {translations[s] || s}
                            </option>
                        ))}
                    </select>

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
                    <select
                        name="useTime"
                        value={form.useTime}
                        onChange={handleChange}
                    >
                        <option value="">-- wybierz --</option>
                        {enums.useTimes.map((u) => (
                            <option key={u} value={u}>
                                {translations[u] || u}
                            </option>
                        ))}
                    </select>

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

                    <h3>Składniki</h3>
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

                    <button type="submit" className="save-btn">
                        Zapisz zmiany
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
