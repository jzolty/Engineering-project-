import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const AdminNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">Skincare Planner</div>

            <div className="navbar-links">
                <Link to="/admin">Panel</Link>
                <Link to="/admin/users">Użytkownicy</Link>
                <Link to="/admin/manage-products">Produkty</Link>
                <Link to="/admin/manage-rules">Reguły</Link>
                <Link to="/admin/reports">Raporty</Link>
                <Link to="/admin/account">Konto</Link>
                <Link to="/">Wyloguj</Link>
            </div>
        </nav>
    );
};

export default AdminNavbar;
