import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/UserNavbar";
import skincarePlanService from "../../services/skincarePlanService";
import EditPlanModal from "../../components/EditPlanModal"; // 🔹 dodany poprawny import
import "./Recommendations.css";

const Recommendations = () => {
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [filterSource, setFilterSource] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null); // 🔹 przeniesione do wnętrza komponentu

    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const categoryLabels = {
        CLEANSER: "Preparat oczyszczający",
        SERUM: "Serum",
        TONER: "Tonik",
        CREAM: "Krem",
        MASK: "Maseczka",
        SPF: "Filtr przeciwsłoneczny",
        EYE_CREAM: "Krem pod oczy",
        MICELLAR_WATER: "Płyn micelarny",
        OTHER: "Inny produkt",
    };
    const routineTimeLabels = {
        MORNING: "Poranna",
        EVENING: "Wieczorna",
        ANY: "Dowolna",
    };


    // Pobranie planów użytkownika
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await skincarePlanService.getPlansByUser(userId);
                const sorted = [...data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPlans(sorted);
                setFilteredPlans(sorted);
                if (sorted.length > 0) setSelectedPlan(sorted[0]);
            } catch (err) {
                console.error("Błąd podczas pobierania planów:", err);
                alert("Nie udało się pobrać planów pielęgnacyjnych.");
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchPlans();
    }, [userId]);

    // 🟠 Filtrowanie po źródle (AUTO / MANUAL / ALL)
    useEffect(() => {
        if (filterSource === "ALL") {
            setFilteredPlans(plans);
        } else {
            setFilteredPlans(plans.filter((p) => p.source === filterSource));
        }
    }, [filterSource, plans]);

    // 🗑️ Usuwanie planu
    const handleDelete = async (planId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten plan?")) return;
        try {
            await skincarePlanService.deletePlan(planId);
            alert("Plan został usunięty.");
            const updated = plans.filter((p) => p.id !== planId);
            setPlans(updated);
            setFilteredPlans(updated);
            if (selectedPlan?.id === planId) setSelectedPlan(null);
        } catch (err) {
            console.error("Błąd usuwania planu:", err);
            alert("Nie udało się usunąć planu.");
        }
    };

    if (loading) return <p style={{ textAlign: "center" }}>Ładowanie planów...</p>;

    return (
        <div className="recommendations-page">
            <Navbar role="user" />

            <div className="recommendations-wrapper">
                {/* Lewy panel – lista planów */}
                <div className="recommendations-sidebar">
                    <div className="filter-section">
                        <h2>Twoje plany pielęgnacyjne</h2>

                        <select
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="filter-select"
                        >
                            <option value="ALL">Wszystkie</option>
                            <option value="AUTO">Automatyczne</option>
                            <option value="MANUAL">Ręczne</option>
                        </select>
                    </div>

                    <ul>
                        {filteredPlans.length === 0 ? (
                            <p>Brak planów w tej kategorii.</p>
                        ) : (
                            filteredPlans.map((plan) => (
                                <li
                                    key={plan.id}
                                    className={selectedPlan?.id === plan.id ? "active" : ""}
                                    onClick={() => setSelectedPlan(plan)}
                                >
                                    <div className="rec-title">
                                        {plan.name || "Plan bez nazwy"}
                                        <span
                                            className={`rec-type ${
                                                plan.source?.toLowerCase() || ""
                                            }`}
                                        >
                                            {plan.source === "AUTO"
                                                ? "Automatyczny"
                                                : "Ręczny"}
                                        </span>
                                    </div>
                                    <div className="rec-date">
                                        {new Date(plan.createdAt).toLocaleDateString()}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Prawy panel – szczegóły planu */}
                <div className="recommendations-details">
                    {selectedPlan ? (
                        <>
                            <h1>{selectedPlan.name}</h1>
                            <p className="recommendation-date">
                                <b>Utworzono:</b>{" "}
                                {new Date(selectedPlan.createdAt).toLocaleString()}
                            </p>
                            <p className="recommendation-date">
                                <b>Ostatnia aktualizacja:</b>{" "}
                                {selectedPlan.updatedAt
                                    ? new Date(selectedPlan.updatedAt).toLocaleString()
                                    : "—"}
                            </p>

                            <p>
                                <b>Typ:</b>{" "}
                                {selectedPlan.source === "AUTO"
                                    ? "Automatyczny"
                                    : "Ręczny"}
                            </p>
                            <p>
                                <b>Pora dnia:</b>{" "}
                                {routineTimeLabels[selectedPlan.routineTime] || selectedPlan.routineTime || "-"}
                            </p>

                            {selectedPlan.note && (
                                <p>
                                    <b>Notatka:</b> {selectedPlan.note}
                                </p>
                            )}

                            <h3>Produkty w planie:</h3>
                            <div className="products-list">
                                {selectedPlan.products?.length > 0 ? (
                                    selectedPlan.products.map((p, i) => (
                                        <div
                                            key={i}
                                            className="product-item clickable"
                                            onClick={() => navigate(`/user/products/${p.product?.id}`)}

                                            title="Zobacz szczegóły produktu"
                                        >
                                            <p>
                                                <b>{p.product?.name}</b> — {p.product?.brand}{" "}
                                                <span>({categoryLabels[p.product?.category] || p.product?.category})</span>
                                            </p>

                                        </div>

                                    ))
                                ) : (
                                    <p>Brak produktów w tym planie.</p>
                                )}
                            </div>

                            <div style={{ marginTop: "1rem" }}>
                                <button
                                    className="edit-btn"
                                    onClick={() => setEditingPlan(selectedPlan)}
                                >
                                    Edytuj plan
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(selectedPlan.id)}
                                >
                                    Usuń plan
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>Wybierz plan z listy po lewej stronie.</p>
                    )}
                </div>
            </div>

            {/* 🔹 Modal edycji */}
            {editingPlan && (
                <EditPlanModal
                    plan={editingPlan}
                    onClose={() => setEditingPlan(null)}
                    onSave={async (updatedData) => {
                        try {
                            //  Wyślij aktualizację
                            await skincarePlanService.updatePlan(editingPlan.id, updatedData);

                            //  Pobierz świeżą wersję planu z backendu
                            const refreshed = await skincarePlanService.getPlanById(editingPlan.id);

                            // Zaktualizuj stan na froncie
                            setPlans((prev) => {
                                const updatedList = prev.map((p) => (p.id === refreshed.id ? refreshed : p));
                                return updatedList.sort(
                                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                );
                            });

                            setFilteredPlans((prev) => {
                                const updatedList = prev.map((p) => (p.id === refreshed.id ? refreshed : p));
                                return updatedList.sort(
                                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                );
                            });

                            setSelectedPlan(refreshed); // 🔹 teraz zobaczysz odświeżone produkty
                            setEditingPlan(null);
                            alert("Plan został zaktualizowany!");
                        } catch (err) {
                            console.error("Błąd edycji:", err);
                            alert("Nie udało się zaktualizować planu.");
                        }
                    }}

                />
            )}
        </div>
    );
};

export default Recommendations;
