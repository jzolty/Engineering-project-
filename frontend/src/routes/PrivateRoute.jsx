import React from "react";
import { Navigate } from "react-router-dom";
import { logout, isTokenExpired } from "../services/authService";

/**
 * PrivateRoute chroni ścieżki w aplikacji na podstawie tokena JWT i roli użytkownika.
 * allowedRoles – lista ról, które mają dostęp (np. ["ADMIN"], ["USER", "ADMIN"])
 * sprawdza token i rolę z localStorage
 * jeśli brak tokena → przekierowanie do logowania
 * jeśli token wygasł → wylogowanie i przekierowanie do logowania
 * jeśli użytkownik nie ma uprawnień → przekierowanie do jego dashboardu
 * jeśli wszystko OK → wpuść użytkownika
 */
const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // 1jeśli brak tokena → przekierowanie do logowania
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // 2 jeśli token wygasł → wylogowanie i przekierowanie
    if (isTokenExpired()) {

        logout();
        return <Navigate to="/" replace />;
    }

    //  jeśli użytkownik nie ma uprawnień → przekierowanie do jego dashboardu
    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === "USER") return <Navigate to="/user" replace />;
        if (role === "ADMIN") return <Navigate to="/admin" replace />;
    }

    //  jeśli wszystko OK → wpuść użytkownika
    return children;
};

export default PrivateRoute;
