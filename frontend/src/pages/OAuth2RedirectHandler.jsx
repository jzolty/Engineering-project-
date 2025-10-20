import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 🔹 Pobieramy token i rolę z URL-a
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const role = params.get("role");

        console.log("🔐 Otrzymano token z OAuth2:", token);
        console.log("👤 Rola użytkownika:", role);

        if (token && role) {
            // 🔹 Zapisujemy do localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            // 🔹 Przekierowujemy zgodnie z rolą
            if (role === "ADMIN") navigate("/admin", { replace: true });
            else navigate("/user", { replace: true });
        } else {
            // 🔹 Jeśli coś poszło nie tak — wróć do logowania
            navigate("/", { replace: true });
        }
    }, [location, navigate]);

    return <p>Trwa logowanie przez Google...</p>;
};

export default OAuth2RedirectHandler;
