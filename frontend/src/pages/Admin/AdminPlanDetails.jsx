import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/AdminNavbar";
import skincarePlanService from "../../services/skincarePlanService";
import "./AdminPlanDetails.css";

const AdminPlanDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    const categoryLabels = {
        CREAM: "Krem",
        SERUM: "Serum",
        TONER: "Tonik",
        SPF: "Filtr przeciwsłoneczny",
        CLEANSER: "Preparat oczyszczający",
        MASK: "Maseczka",
        MICELLAR_WATER: "Płyn micelarny",
        EYE_CREAM: "Krem pod oczy",
        OTHER: "Inny produkt",
    };

    const useTimeLabels = {
        MORNING: "Poranna",
        EVENING: "Wieczorna",
        ANY: "Dowolna",
    };


    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const data = await skincarePlanService.getPlanById(id);
                setPlan(data);
            } catch (err) {
                console.error("Błąd pobierania planu:", err);
                alert("Nie udało się pobrać szczegółów planu.");
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [id]);

    if (loading) return <p className="loading">Ładowanie...</p>;
    if (!plan) return <p>Nie znaleziono planu.</p>;

    return (
        <div className="admin-page">
            <Navbar />
            <div className="admin-details-container">
                <button className="back-btn" onClick={() => navigate("/admin/manage-plans")}>
                    ← Powrót do listy
                </button>

                <div className="plan-header">
                    <h1>{plan.name}</h1>
                    <div className="plan-meta">
                        <p><b>Użytkownik:</b> {plan.user?.username || "—"}</p>
                        <p><b>Typ:</b> {plan.source === "AUTO" ? "Automatyczny" : "Ręczny"}</p>
                        <p><b>Pora dnia:</b> {useTimeLabels[plan.routineTime] || plan.routineTime}</p>
                        <p><b>Utworzono:</b> {new Date(plan.createdAt).toLocaleDateString()}</p>
                        <p><b>Ostatnia aktualizacja:</b> {new Date(plan.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <h2>Produkty w planie:</h2>
                {plan.products?.length > 0 ? (
                    <div className="product-grid">
                        {plan.products.map((p) => (
                            <div
                                className="product-card clickable"
                                onClick={() => navigate(`/user/products/${p.product?.id}`)}
                                title="Zobacz szczegóły produktu"
                            >
                                <h4>{p.product?.name}</h4>
                                <p className="brand">{p.product?.brand}</p>
                                <span className="category">
    {categoryLabels[p.product?.category] || p.product?.category}
  </span>
                            </div>

                        ))}
                    </div>
                ) : (
                    <p>Brak produktów w tym planie.</p>
                )}
            </div>
        </div>
    );
};

export default AdminPlanDetails;
