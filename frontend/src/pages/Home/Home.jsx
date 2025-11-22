import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import api from "../../services/axiosConfig";
import "./Home.css";

const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [registerData, setRegisterData] = useState({
        email: "",
        username: "",
        password: "",
    });
    const [registerMessage, setRegisterMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("sessionExpired")) {
            setSessionExpired(true);
            localStorage.removeItem("sessionExpired");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            if (result.role === "ADMIN") navigate("/admin");
            else navigate("/user");
        } else {
            setError(result.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post(
                "/auth/register",
                JSON.stringify(registerData),
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            setRegisterMessage("Rejestracja zakończona pomyślnie!");
            setTimeout(() => {
                setShowRegister(false);
                setRegisterMessage("");
            }, 2000);
        } catch (error) {
            console.error(error);
            setRegisterMessage("Rejestracja nie powiodła się. Spróbuj ponownie.");
        }
    };

    return (
        <div className="home-container">
            <div className="home-content">
                {/* Lewa kolumna – opis aplikacji */}
                <div className="info-section">
                    <h2>Twoja droga do lepszej pielęgnacji skóry twarzy </h2>
                    <ul>
                        <li>Otrzymuj spersonalizowane rekomendacje produktów</li>
                        <li>Twórz własne rutyny pielęgnacyjne</li>
                        <li>Monitoruj postępy i poznaj potrzeby swojej skóry</li>
                        <li>Dowiedz się, które składniki są dla Ciebie najlepsze</li>
                    </ul>
                </div>

                {/* Prawa kolumna – logowanie */}
                <div className="home-card">
                    <h1 className="home-title">Skincare Planner</h1>
                    <p className="home-subtitle">Zaloguj się, aby kontynuować</p>

                    {sessionExpired && (
                        <p className="expired-message">🔒 Sesja wygasła, zaloguj się ponownie.</p>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Zaloguj się</button>
                    </form>

                    <button
                        className="google-login-btn"
                        onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
                    >
                        <img
                            src="https://developers.google.com/identity/images/g-logo.png"
                            alt="Google"
                            className="google-icon"
                        />
                        Zaloguj przez Google
                    </button>

                    {error && <p className="error">{error}</p>}

                    <button
                        className="toggle-register-btn"
                        onClick={() => setShowRegister(!showRegister)}
                    >
                        {showRegister ? "← Wróć do logowania" : "Zarejestruj się"}
                    </button>

                    {showRegister && (
                        <form onSubmit={handleRegister} className="register-form">
                            <input
                                type="email"
                                placeholder="Email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, email: e.target.value })
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nazwa użytkownika"
                                value={registerData.username}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, username: e.target.value })
                                }
                                required
                            />
                            <input
                                type="password"
                                placeholder="Hasło"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({ ...registerData, password: e.target.value })
                                }
                                required
                            />
                            <button type="submit">Utwórz konto</button>
                            {registerMessage && (
                                <p className="register-message">{registerMessage}</p>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Home;
