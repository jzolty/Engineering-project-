import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { logout } from "../../services/authService"; // 🧩 import

const AdminNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">Skincare Planner</div>

            <div className="navbar-links">
                <Link to="/admin">Panel</Link>
                <Link to="/admin/users">Użytkownicy</Link>
                <Link to="/admin/manage-products">Produkty</Link>
                <Link to="/admin/manage-rules">Reguły</Link>
                {/*<Link to="/admin/reports">Raporty</Link>*/}
                <Link to="/admin/account">Konto</Link>

                {/* 🔒 poprawione */}
                <button className="logout-btn" onClick={logout}>
                    Wyloguj
                </button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
