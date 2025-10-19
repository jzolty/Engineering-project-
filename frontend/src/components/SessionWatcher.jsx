import { useEffect } from "react";
import { checkTokenExpiration } from "../services/authService";

const SessionWatcher = () => {
    useEffect(() => {
        // Sprawdzaj co 60 sekund (1 minuta)
        const interval = setInterval(() => {
            checkTokenExpiration();
        }, 60000);

        // Wyczyść po odmontowaniu komponentu
        return () => clearInterval(interval);
    }, []);

    return null; // nic nie renderuje
};

export default SessionWatcher;
