import React from "react";
import Navbar from "../../components/Navbar/AdminNavbar";
import UserList from "./UserList";
import "../../assets/styles/Account.css";



const AdminAccount = () => {
    return (
        <div className="account-page">
            <Navbar role="admin" />

            <div className="account-container">
                <h2>Panel administratora</h2>
                <p>Zarządzaj swoim kontem i użytkownikami systemu.</p>

                {/* Sekcja edycji własnych danych */}
                <form className="account-form">
                    <label>Imię</label>
                    <input type="text" defaultValue="String_ADMIN" />

                    <label>Nazwisko</label>
                    <input type="text" defaultValue="Example_ADMIN" />

                    <label>Nazwa użytkownika</label>
                    <input type="text" defaultValue="stringA" />

                    <label>E-mail</label>
                    <input type="email" defaultValue="stringA@example.com" />

                    <label>Data utworzenia konta</label>
                    <input type="text" value="2025-05-17" readOnly />

                    <label>Rola</label>
                    <input type="text" value="ADMIN" readOnly />

                    <button type="button">Zapisz zmiany</button>
                </form>


            </div>
        </div>
    );
};

export default AdminAccount;
