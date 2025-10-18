import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const UserNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">Skincare Planner</div>

            <div className="navbar-links">
                <Link to="/user">Panel</Link>
                <Link to="/user/skin-type">Analiza skóry</Link>
                <Link to="/user/recommendations">Rekomendacje</Link>
                <Link to="/user/products">Produkty</Link>
                <Link to="/user/account">Konto</Link>
                <Link to="/">Wyloguj</Link>
            </div>
        </nav>
    );
};

export default UserNavbar;
