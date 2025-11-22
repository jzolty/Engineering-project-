import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/UserNavbar";
import skincarePlanService from "../../services/skincarePlanService";
import EditPlanModal from "../../components/EditPlanModal";
import { getCurrentUser } from "../../services/authService";
import "./Recommendations.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const Recommendations = () => {
    const [user, setUser] = useState(null);
    const [plans, setPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [filterSource, setFilterSource] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);

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

    // Pobierz dane zalogowanego użytkownika z tokena
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    alert("Sesja wygasła. Zaloguj się ponownie.");
                    window.location.href = "/login";
                    return;
                }
                setUser(currentUser);
            } catch (err) {
                console.error("Błąd pobierania użytkownika:", err);
                alert("Nie udało się pobrać danych użytkownika.");
            }
        };
        fetchUser();
    }, []);

    //  Pobierz plany użytkownika po tym, jak załaduje się `user`
    useEffect(() => {
        const fetchPlans = async () => {
            if (!user?.id) return;
            try {
                const data = await skincarePlanService.getPlansByUser(user.id);
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

        fetchPlans();
    }, [user]);

    // Filtrowanie planów
    useEffect(() => {
        if (filterSource === "ALL") {
            setFilteredPlans(plans);
        } else {
            setFilteredPlans(plans.filter((p) => p.source === filterSource));
        }
    }, [filterSource, plans]);

    //  Usuwanie planu
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

    //  Generowanie PDF dla wybranego planu
    const generatePlanPDF = (plan) => {
        if (!plan) {
            alert("Brak danych planu.");
            return;
        }

        const doc = new jsPDF({ encoding: "UTF-8" });

        // Pomocnicza funkcja zamieniająca polskie znaki (bo jsPDF ma z tym problem)
        const fixPL = (text) =>
            text
                ?.replaceAll("ą", "a").replaceAll("ć", "c").replaceAll("ę", "e")
                .replaceAll("ł", "l").replaceAll("ń", "n").replaceAll("ó", "o")
                .replaceAll("ś", "s").replaceAll("ź", "z").replaceAll("ż", "z")
                .replaceAll("Ą", "A").replaceAll("Ć", "C").replaceAll("Ę", "E")
                .replaceAll("Ł", "L").replaceAll("Ń", "N").replaceAll("Ó", "O")
                .replaceAll("Ś", "S").replaceAll("Ź", "Z").replaceAll("Ż", "Z");

        // 🔹 Nagłówek
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(fixPL(`Plan pielegnacyjny: ${plan.name || "Bez nazwy"}`), 14, 20);

        // 🔹 Informacje o planie
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(fixPL(`Typ: ${plan.source === "AUTO" ? "Automatyczny" : "Reczny"}`), 14, 30);
        doc.text(
            fixPL(
                `Pora dnia: ${
                    plan.routineTime === "MORNING"
                        ? "Poranna"
                        : plan.routineTime === "EVENING"
                            ? "Wieczorna"
                            : "Dowolna"
                }`
            ),
            14,
            37
        );
        doc.text(`Utworzono: ${new Date(plan.createdAt).toLocaleString()}`, 14, 44);
        if (plan.updatedAt) {
            doc.text(`Ostatnia aktualizacja: ${new Date(plan.updatedAt).toLocaleString()}`, 14, 51);
        }

        // 🔹 Produkty w planie
        const tableData = (plan.products || []).map((p) => [
            fixPL(p.product?.name || "—"),
            fixPL(p.product?.brand || "—"),
            fixPL(
                p.product?.category === "CREAM"
                    ? "Krem"
                    : p.product?.category === "SERUM"
                        ? "Serum"
                        : p.product?.category === "CLEANSER"
                            ? "Zel do mycia"
                            : p.product?.category === "TONER"
                                ? "Tonik"
                                : p.product?.category === "MASK"
                                    ? "Maseczka"
                                    : p.product?.category === "SPF"
                                        ? "Filtr przeciwsłoneczny"
                                        : "Inny"
            ),
        ]);

        autoTable(doc, {
            startY: 65,
            head: [[fixPL("Produkt"), fixPL("Marka"), fixPL("Typ")]],
            body: tableData,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: {
                fillColor: [245, 228, 218],
                textColor: [75, 50, 30],
            },
        });

        //  Stopka z datą generowania
        const now = new Date();
        const formatted = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        doc.setFontSize(10);
        doc.text(fixPL(`Wygenerowano: ${formatted}`), 14, doc.internal.pageSize.height - 10);

        // Zapis PDF
        doc.save(`PlanPielegnacyjny_${plan.name || "bez_nazwy"}.pdf`);
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
                                {routineTimeLabels[selectedPlan.routineTime] ||
                                    selectedPlan.routineTime ||
                                    "-"}
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
                                            onClick={() =>
                                                navigate(`/user/products/${p.product?.id}`)
                                            }
                                            title="Zobacz szczegóły produktu"
                                        >
                                            <p>
                                                <b>{p.product?.name}</b> — {p.product?.brand}{" "}
                                                <span>
                          (
                                                    {categoryLabels[p.product?.category] ||
                                                        p.product?.category}
                                                    )
                        </span>
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

                                <button
                                    className="report-btn"
                                    onClick={() => generatePlanPDF(selectedPlan)}
                                    style={{ marginLeft: "0.5rem", backgroundColor: "#d8b8a3" }}
                                >
                                    Pobierz plan PDF
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
                            await skincarePlanService.updatePlan(editingPlan.id, updatedData);
                            const refreshed = await skincarePlanService.getPlanById(
                                editingPlan.id
                            );

                            setPlans((prev) => {
                                const updatedList = prev.map((p) =>
                                    p.id === refreshed.id ? refreshed : p
                                );
                                return updatedList.sort(
                                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                );
                            });

                            setFilteredPlans((prev) => {
                                const updatedList = prev.map((p) =>
                                    p.id === refreshed.id ? refreshed : p
                                );
                                return updatedList.sort(
                                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                );
                            });

                            setSelectedPlan(refreshed);
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
