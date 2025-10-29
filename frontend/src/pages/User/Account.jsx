import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/UserNavbar";
import { getCurrentUser, updateEmail, updateUsername } from "../../services/authService";
import "../../assets/styles/Account.css";

const UserAccount = ({ role = "user" }) => {
    const [user, setUser] = useState({
        id: "",
        email: "",
        username: "",
        role: "",
        provider: "",
        providerId: "",
        createdAt: "",
        updatedAt: "",
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getCurrentUser();
            if (data) {
                setUser(data);
                setNewEmail(data.email);
                setNewUsername(data.username);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const isGoogleUser = user.provider === "google";

    const handleSave = async () => {
        try {
            let updated = false;

            // Najpierw username (bo email wymaga potem ponownego logowania)
            if (!isGoogleUser && newUsername !== user.username) {
                await updateUsername(newUsername);
                updated = true;
            }

            // Następnie e-mail (tylko jeśli nie Google)
            if (!isGoogleUser && newEmail !== user.email) {
                await updateEmail(newEmail);
                updated = true;
                alert("Adres e-mail został zmieniony. Zaloguj się ponownie, aby kontynuować.");
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            if (updated) {
                setMessage("Dane zostały zaktualizowane!");
                const refreshed = await getCurrentUser();
                setUser(refreshed);
            } else {
                setMessage("Nie wprowadzono żadnych zmian.");
            }

            setIsEditing(false);
        } catch (err) {
            setMessage(` Błąd: ${err}`);
        }
    };

    if (loading) return <p>Ładowanie danych konta...</p>;

    return (
        <div className="account-page">
            <Navbar role={role} />
            <div className="account-container">
                <h2>Twoje konto</h2>
                <p>Zarządzaj swoimi danymi i informacjami konta.</p>
                {message && <p className="account-message">{message}</p>}

                <form className="account-form" onSubmit={(e) => e.preventDefault()}>
                    <label>Nazwa użytkownika</label>
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        readOnly={!isEditing || isGoogleUser}
                    />

                    <label>E-mail</label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        readOnly={!isEditing || isGoogleUser}
                    />

                    {isGoogleUser && (
                        <p style={{ color: "gray", fontStyle: "italic" }}>
                             Konto Google – edycja danych jest niedostępna.
                        </p>
                    )}

                    <label>Rola</label>
                    <input type="text" value={user.role} readOnly />

                    <label>Data utworzenia konta</label>
                    <input type="text" value={user.createdAt} readOnly />

                    <label>Ostatnia aktualizacja</label>
                    <input type="text" value={user.updatedAt} readOnly />

                    {isEditing ? (
                        <button type="button" onClick={handleSave}> Zapisz zmiany</button>
                    ) : (
                        <button type="button" onClick={() => setIsEditing(true)}> Edytuj dane</button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserAccount;
