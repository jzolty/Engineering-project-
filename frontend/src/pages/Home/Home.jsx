// src/pages/Home/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-card">
                <h1 className="logo-text">Skincare Planner</h1>
                <p>Twój osobisty przewodnik po pielęgnacji skóry</p>

                <div className="button-group">
                    <button className="home-btn admin-btn" onClick={() => navigate("/admin")}>
                        Panel administratora
                    </button>
                    <button className="home-btn user-btn" onClick={() => navigate("/user")}>
                        Dla użytkownika
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Home;
