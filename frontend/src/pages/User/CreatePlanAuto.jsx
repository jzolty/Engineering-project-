import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/UserNavbar";
import skincarePlanService from "../../services/skincarePlanService";
import skinAnalysisService from "../../services/skinAnalysisService";
import { getCurrentUser } from "../../services/authService";
import "./CreatePlanAuto.css";

const CreatePlanAuto = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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

    // 🔹 Pobierz zalogowanego użytkownika z tokena
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                alert("Sesja wygasła. Zaloguj się ponownie.");
                window.location.href = "/login";
                return;
            }
            setUser(currentUser);
        };
        fetchUser();
    }, []);

    // 🔹 Pobierz cele i składniki
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
        if (!user?.id) {
            alert("Nie udało się zidentyfikować użytkownika.");
            return;
        }

        setLoading(true);
        try {
            // 1️⃣ Zapis analizy skóry
            const analysis = await skinAnalysisService.createAnalysis(user.id, form);
            const analysisId = analysis.id;

            // 2️⃣ Wygenerowanie planu automatycznego
            await skincarePlanService.createAutoPlan(user.id, analysisId);

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

    const useTimeLabels = {
        ANY: "Dowolna",
        MORNING: "Poranna",
        EVENING: "Wieczorna",
    };

    return (
        <div className="manual-plan-wrapper">
            <Navbar role="user" />
            <div className="manual-plan-container">
                <div className="manual-left">
                    <form onSubmit={handleSubmit}>
                        {/* --- Płeć i wiek --- */}
                        <div className="section">
                            <h3>Płeć i grupa wiekowa:</h3>
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

                            <h4 className="subheading">Grupa wiekowa:</h4>
                            <div className="option-group">
                                {Object.entries(ageGroups).map(([key, label]) => (
                                    <label key={key} className="option-item">
                                        <input
                                            type="radio"
                                            name="ageGroup"
                                            value={key}
                                            checked={form.ageGroup === key}
                                            onChange={(e) =>
                                                setForm({ ...form, ageGroup: e.target.value })
                                            }
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
                                {["NORMAL", "DRY", "OILY", "COMBINATION", "SENSITIVE", "MATURE_SKIN"].map(
                                    (type) => (
                                        <label key={type} className="option-item">
                                            <input
                                                type="checkbox"
                                                checked={form.skinTypes.includes(type)}
                                                onChange={(e) => {
                                                    const selected = e.target.checked
                                                        ? [...form.skinTypes, type]
                                                        : form.skinTypes.filter((s) => s !== type);
                                                    if (selected.length <= 3)
                                                        setForm({ ...form, skinTypes: selected });
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
                                    )
                                )}
                            </div>
                        </div>

                        {/* --- Preferencje, składniki, pora dnia --- */}
                        {/* (pozostała część formularza bez zmian) */}

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
