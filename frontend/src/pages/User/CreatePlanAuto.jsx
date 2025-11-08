import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/UserNavbar";
import skincarePlanService from "../../services/skincarePlanService";
import skinAnalysisService from "../../services/skinAnalysisService";
import "./CreatePlanAuto.css";


const CreatePlanAuto = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [goals, setGoals] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const [form, setForm] = useState({
        sex: "",
        ageGroup: "",
        skinTypes: [],
        goals: [],
        veganPreference: false,
        ecoPreference: false,
        crueltyFreePreference: false,
        pregnant: false,
        routineTime: "ANY",
        avoidIngredients: [],
    });

    const [loading, setLoading] = useState(false);

    // 🔹 Pobierz cele i składniki z backendu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resGoals = await fetch("http://localhost:8080/api/goals");
                const goalsData = await resGoals.json();
                setGoals(goalsData);

                const resIngredients = await fetch("http://localhost:8080/api/ingredients");
                const ingData = await resIngredients.json();
                setIngredients(ingData);
            } catch (err) {
                console.error("Błąd podczas pobierania danych:", err);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1️⃣ Zapis analizy skóry
            const analysis = await skinAnalysisService.createAnalysis(userId, form);
            const analysisId = analysis.id;

            // 2️⃣ Wygenerowanie planu automatycznego
            await skincarePlanService.createAutoPlan(userId, analysisId);

            alert("Plan pielęgnacyjny został wygenerowany automatycznie!");
            navigate("/user/recommendations");
        } catch (err) {
            console.error("Błąd podczas generowania planu:", err);
            alert("Nie udało się wygenerować planu.");
        } finally {
            setLoading(false);
        }
    };

    // 🔸 Tłumaczenia enumów
    const ageGroups = {
        TEEN: "Nastolatek",
        YOUNG_ADULT: "Młody dorosły (18-30)",
        ADULT: "Dorosły (30-40)",
        MATURE: "Dojrzała skóra (40+)",
        ALL: "Każdy wiek",
    };

    const skinTypeLabels = {
        NORMAL: "Normalna",
        DRY: "Sucha",
        OILY: "Tłusta",
        COMBINATION: "Mieszana",
        SENSITIVE: "Wrażliwa",
        MATURE_SKIN: "Dojrzała skóra",
    };

    const useTimeLabels = {
        ANY: "Dowolna",
        MORNING: "Poranna",
        EVENING: "Wieczorna",
    };

    // 🔸 Funkcje pomocnicze
    const toggleArrayValue = (field, value) => {
        setForm((prev) => {
            const updated = prev[field].includes(value)
                ? prev[field].filter((v) => v !== value)
                : [...prev[field], value];
            return { ...prev, [field]: updated };
        });
    };

    return (
        <div className="manual-plan-wrapper">
            <Navbar role="user" />
            <div className="manual-plan-container">
                <div className="manual-left">
                    <form onSubmit={handleSubmit}>
                        {/* --- Płeć i wiek --- */}
                        {/* --- Płeć i wiek --- */}
                        <div className="section">
                            <h3>Płeć i grupa wiekowa:</h3>

                            {/* PŁEĆ */}
                            <div className="option-group">
                                <label className="option-item">
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="FEMALE"
                                        checked={form.sex === "FEMALE"}
                                        onChange={(e) => setForm({ ...form, sex: e.target.value })}
                                    />
                                    <span>Kobieta</span>
                                </label>
                                <label className="option-item">
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="MALE"
                                        checked={form.sex === "MALE"}
                                        onChange={(e) => setForm({ ...form, sex: e.target.value })}
                                    />
                                    <span>Mężczyzna</span>
                                </label>
                            </div>

                            {/* GRUPA WIEKOWA */}
                            <h4 className="subheading">Grupa wiekowa:</h4>
                            <div className="option-group">
                                {Object.entries(ageGroups).map(([key, label]) => (
                                    <label key={key} className="option-item">
                                        <input
                                            type="radio"
                                            name="ageGroup"
                                            value={key}
                                            checked={form.ageGroup === key}
                                            onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>


                        {/* --- Typ skóry --- */}
                        <div className="section">
                            <h3>Typ skóry (max 3):</h3>
                            <div className="option-group">
                                {["NORMAL", "DRY", "OILY", "COMBINATION", "SENSITIVE", "MATURE_SKIN"].map((type) => (
                                    <label key={type} className="option-item">
                                        <input
                                            type="checkbox"
                                            checked={form.skinTypes.includes(type)}
                                            onChange={(e) => {
                                                const selected = e.target.checked
                                                    ? [...form.skinTypes, type]
                                                    : form.skinTypes.filter((s) => s !== type);
                                                if (selected.length <= 3) setForm({ ...form, skinTypes: selected });
                                            }}
                                        />
                                        <span>
                        {{
                            NORMAL: "Normalna",
                            DRY: "Sucha",
                            OILY: "Tłusta",
                            COMBINATION: "Mieszana",
                            SENSITIVE: "Wrażliwa",
                            MATURE_SKIN: "Dojrzała",
                        }[type]}
                    </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* --- Cele pielęgnacji --- */}
                        <div className="section">
                            <h3>Cele pielęgnacji (max 5):</h3>
                            <div className="option-group goals-grid">

                            {goals.map((goal) => (
                                    <label key={goal.id} className="option-item">
                                        <input
                                            type="checkbox"
                                            checked={form.goals.includes(goal.name)}
                                            onChange={(e) => {
                                                const selected = e.target.checked
                                                    ? [...form.goals, goal.name]
                                                    : form.goals.filter((g) => g !== goal.name);
                                                if (selected.length <= 5) setForm({ ...form, goals: selected });
                                            }}
                                        />
                                        <span>{goal.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* --- Preferencje --- */}
                        <div className="section">
                            <h3>Preferencje:</h3>
                            <div className="option-group">
                                <label className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={form.veganPreference}
                                        onChange={(e) => setForm({ ...form, veganPreference: e.target.checked })}
                                    />
                                    <span>Wegańskie</span>
                                </label>
                                <label className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={form.ecoPreference}
                                        onChange={(e) => setForm({ ...form, ecoPreference: e.target.checked })}
                                    />
                                    <span>Ekologiczne</span>
                                </label>
                                <label className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={form.crueltyFreePreference}
                                        onChange={(e) => setForm({ ...form, crueltyFreePreference: e.target.checked })}
                                    />
                                    <span>Cruelty-free</span>
                                </label>
                                <label className="option-item">
                                    <input
                                        type="checkbox"
                                        checked={form.pregnant}
                                        onChange={(e) => setForm({ ...form, pregnant: e.target.checked })}
                                    />
                                    <span>Jestem w ciąży</span>
                                </label>
                            </div>
                        </div>

                        {/* --- Składniki do unikania --- */}
                        <div className="section">
                            <h3>Składniki do unikania:</h3>
                            <Select
                                isMulti
                                options={ingredients.map((i) => ({ value: i.name, label: i.name }))}
                                value={form.avoidIngredients.map((name) => ({ value: name, label: name }))}
                                onChange={(selected) =>
                                    setForm({
                                        ...form,
                                        avoidIngredients: selected.map((s) => s.value),
                                    })
                                }
                                placeholder="Wybierz składniki..."
                                classNamePrefix="select"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: "10px",
                                        borderColor: "#e3d9cf",
                                        padding: "2px",
                                        fontFamily: "Open Sans, sans-serif",
                                        fontSize: "0.95rem",
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected
                                            ? "#e9ddd2"
                                            : state.isFocused
                                                ? "#f8f5f2"
                                                : "#fff",
                                        color: "#4b3b2a",
                                        cursor: "pointer",
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: "#f2eae4",
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: "#4b3b2a",
                                        fontWeight: "500",
                                    }),
                                    multiValueRemove: (base) => ({
                                        ...base,
                                        color: "#a57c65",
                                        ':hover': { backgroundColor: '#e3d9cf', color: '#4b3b2a' }
                                    }),
                                }}
                            />
                        </div>


                        {/* --- Pora dnia --- */}
                        <div className="section">
                            <h3>Pora dnia:</h3>
                            <div className="option-group">
                                {Object.entries(useTimeLabels).map(([key, label]) => (
                                    <label key={key} className="option-item">
                                        <input
                                            type="radio"
                                            name="routineTime"
                                            value={key}
                                            checked={form.routineTime === key}
                                            onChange={(e) => setForm({ ...form, routineTime: e.target.value })}
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* --- Przycisk --- */}
                        <button type="submit" disabled={loading}>
                            {loading ? "Generowanie..." : "Zapisz i wygeneruj plan"}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default CreatePlanAuto;
