import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ role }) => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">Skincare Planner</div>

            <div className="navbar-links">
                {role === "user" && (
                    <>
                        <Link to="/user">Panel</Link>
                        <Link to="/user/skin-type">Analiza skóry</Link>
                        <Link to="/user/recommendations">Rekomendacje</Link>
                        <Link to="/user/plans">Plany</Link>
                        <Link to="/user/account">Konto</Link>
                    </>
                )}
                {role === "admin" && (
                    <>
                        <Link to="/admin">Panel</Link>
                        <Link to="/admin/manage-products">Produkty</Link>
                        <Link to="/admin/manage-users">Użytkownicy</Link>
                        <Link to="/admin/manage-rules">Reguły</Link>
                        <Link to="/admin/reports">Raporty</Link>
                    </>
                )}
                <Link to="/">Wyloguj</Link>
            </div>
        </nav>
    );
};

export default Navbar;
