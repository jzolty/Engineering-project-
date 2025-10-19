import api from "./axiosConfig";

const API_URL = "/auth"; // dzięki baseURL w axiosConfig, wystarczy /auth

// Logowanie użytkownika
export const login = async (email, password) => {
    try {
        const response = await api.post(`${API_URL}/login`, {
            email,
            password,
        });

        const { token, role, email: userEmail } = response.data;

        // zapis tokena i roli do localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("email", userEmail);

        return { success: true, role };
    } catch (error) {
        console.error("Błąd logowania:", error);
        return { success: false, message: "Nieprawidłowy login lub hasło" };
    }
};

// Wylogowanie użytkownika
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    // 💡 od razu przekierowanie do strony głównej
    window.location.href = "/";
};

// Pobieranie danych aktualnie zalogowanego użytkownika
export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const response = await api.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Błąd pobierania danych użytkownika:", error);
        return null;
    }
};

// Sprawdzenie, czy token JWT wygasł
// Sprawdzenie, czy token JWT wygasł
export const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true; // brak tokena = wygasły

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        return Date.now() > exp; // true jeśli już wygasł
    } catch (error) {
        console.error("Błąd dekodowania tokena:", error);
        return true;
    }
};

// Automatyczne wylogowanie, jeśli token wygasł
export const checkTokenExpiration = () => {
    if (isTokenExpired()) {
        localStorage.setItem("sessionExpired", "true"); // 🔹 flaga do komunikatu
        logout();
    }
};


