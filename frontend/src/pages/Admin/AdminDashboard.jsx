import React from "react";
import Navbar from "../../components/common/Navbar";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <Navbar role="admin" />
            <div className="dashboard-content">
                <h1>Panel administratora</h1>
                <p>Tu znajdziesz funkcje zarządzania użytkownikami, produktami, regułami i raportami.</p>

                <div className="dashboard-grid">
                    <div className="dashboard-card" onClick={() => navigate("/admin/manage-users")}>
                        <h3>Zarządzaj użytkownikami</h3>
                        <p>Dodawaj, edytuj i usuwaj konta użytkowników.</p>
                    </div>
                    <div className="dashboard-card" onClick={() => navigate("/admin/manage-products")}>
                        <h3>Zarządzaj produktami</h3>
                        <p>Aktualizuj bazę kosmetyków i składników.</p>
                    </div>
                    <div className="dashboard-card" onClick={() => navigate("/admin/manage-rules")}>
                        <h3>Zarządzaj regułami rekomendacji</h3>
                        <p>Określaj zależności między składnikami a typami skóry.</p>
                    </div>
                    <div className="dashboard-card" onClick={() => navigate("/admin/reports")}>
                        <h3>Raporty i podsumowania</h3>
                        <p>Generuj raporty na podstawie danych systemowych.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
