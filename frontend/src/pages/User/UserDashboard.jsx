import React from "react";
import Navbar from "../../components/Navbar/UserNavbar";

import "./UserDashboard.css";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <Navbar role="user" />
            <div className="dashboard-content">
                <h1>Panel użytkownika</h1>
                <p>Witaj! Tu znajdziesz analizę skóry, rekomendacje i plany pielęgnacyjne.</p>

                <div className="dashboard-grid">
                    {/* 🧴 Duży kafelek u góry */}
                    <div className="wide-card">
                        <h3>Utwórz plan pielęgnacji</h3>
                        <p>Stwórz własną rutynę pielęgnacyjną.</p>
                        <div className="sub-card-group">
                            <div className="sub-card" onClick={() => navigate("/user/create-plan-manual")}>
                                Ręcznie
                            </div>
                            <div className="sub-card" onClick={() => navigate("/user/create-plan-auto")}>
                                Automatycznie
                            </div>
                        </div>
                    </div>

                    {/* 💆‍♀️ Pozostałe cztery kafelki w jednym wierszu */}
                    <div className="dashboard-row">
                        <div className="dashboard-card" onClick={() => navigate("/user/skin-type")}>
                            <h3>Poznaj swój typ skóry</h3>
                            <p>Wypełnij ankietę i dowiedz się, jaką masz cerę.</p>
                        </div>


                        <div className="dashboard-card" onClick={() => navigate("/user/recommendations")}>
                            <h3>Moje rekomendacje</h3>
                            <p>Przeglądnij swoje plany pielęgnacji.</p>
                        </div>

                        <div className="dashboard-card" onClick={() => navigate("/user/products")}>
                            <h3>Przeglądaj produkty</h3>
                            <p>Odkryj naszą bazę kosmetyków i filtruj po kategoriach.</p>
                        </div>

                        <div className="dashboard-card" onClick={() => navigate("/user/account")}>
                            <h3>Twoje konto</h3>
                            <p>Zarządzaj swoim profilem i ustawieniami.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
