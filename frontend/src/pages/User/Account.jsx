import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/UserNavbar";
import { getCurrentUser } from "../../services/authService";
import "../../assets/styles/Account.css";

const UserAccount = () => {
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

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getCurrentUser();
            if (data) {
                setUser({
                    id: data.id || "",
                    email: data.email || "",
                    username: data.username || "",
                    role: data.role || "",
                    provider: data.provider || "",
                    providerId: data.providerId || "",
                    createdAt: data.createdAt ? formatDate(data.createdAt) : "",
                    updatedAt: data.updatedAt ? formatDate(data.updatedAt) : "",
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("pl-PL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return <p>Ładowanie danych konta...</p>;
    }

    return (
        <div className="account-page">
            <Navbar role="user" />

            <div className="account-container">
                <h2>Twoje konto</h2>
                <p>Zarządzaj swoimi danymi i informacjami konta.</p>

                <form className="account-form">
                    <label>ID użytkownika</label>
                    <input type="text" value={user.id} readOnly />

                    <label>Nazwa użytkownika</label>
                    <input type="text" value={user.username} readOnly />

                    <label>E-mail</label>
                    <input type="email" value={user.email} readOnly />

                    <label>Rola</label>
                    <input type="text" value={user.role} readOnly />

                    <label>Provider</label>
                    <input type="text" value={user.provider} readOnly />

                    <label>ID providera</label>
                    <input type="text" value={user.providerId || "—"} readOnly />

                    <label>Data utworzenia konta</label>
                    <input type="text" value={user.createdAt} readOnly />

                    <label>Ostatnia aktualizacja</label>
                    <input type="text" value={user.updatedAt} readOnly />

                    <button type="button" disabled>
                        Zapisz zmiany (wkrótce)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserAccount;
