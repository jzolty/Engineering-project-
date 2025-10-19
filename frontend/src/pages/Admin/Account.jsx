import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/AdminNavbar";
import { getCurrentUser } from "../../services/authService";
import "../../assets/styles/Account.css";

const AdminAccount = () => {
    const [admin, setAdmin] = useState({
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
        const fetchAdmin = async () => {
            const data = await getCurrentUser();
            if (data) {
                setAdmin({
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
        fetchAdmin();
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
            <Navbar role="admin" />

            <div className="account-container">
                <h2>Panel administratora</h2>
                <p>Zarządzaj swoim kontem i użytkownikami systemu.</p>

                <form className="account-form">
                    <label>ID użytkownika</label>
                    <input type="text" value={admin.id} readOnly />

                    <label>Nazwa użytkownika</label>
                    <input type="text" value={admin.username} readOnly />

                    <label>E-mail</label>
                    <input type="email" value={admin.email} readOnly />

                    <label>Rola</label>
                    <input type="text" value={admin.role} readOnly />

                    <label>Provider</label>
                    <input type="text" value={admin.provider} readOnly />

                    <label>ID providera</label>
                    <input type="text" value={admin.providerId || "—"} readOnly />

                    <label>Data utworzenia konta</label>
                    <input type="text" value={admin.createdAt} readOnly />

                    <label>Ostatnia aktualizacja</label>
                    <input type="text" value={admin.updatedAt} readOnly />

                    <button type="button" disabled>
                        Zapisz zmiany (wkrótce)
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminAccount;
