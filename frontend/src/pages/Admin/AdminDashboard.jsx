import React from "react";
import Navbar from "../../components/Navbar/AdminNavbar";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <Navbar role="admin" />

            <div className="dashboard-content">
                <h1>Panel administratora</h1>
                <p>
                    Tu znajdziesz funkcje zarządzania użytkownikami, produktami,
                    regułami i raportami.
                </p>

                {/* === GRID 2x2 === */}
                <div className="dashboard-row">
                    <div className="dashboard-card" onClick={() => navigate("/admin/users")}>
                        <h3>Zarządzaj użytkownikami</h3>
                        <p>Przeglądaj i usuwaj konta użytkowników.</p>
                    </div>

                    <div className="dashboard-card" onClick={() => navigate("/admin/manage-products")}>
                        <h3>Zarządzaj produktami</h3>
                        <p>Aktualizuj bazę kosmetyków i składników.</p>
                    </div>

                    <div className="dashboard-card" onClick={() => navigate("/admin/manage-rules")}>
                        <h3>Zarządzaj regułami rekomendacji</h3>
                        <p>Określaj zależności między składnikami a typami skóry.</p>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
