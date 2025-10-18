import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/UserNavbar";
import "../../assets/styles/Account.css";



const Account = () => {
    const [user, setUser] = useState({
        firstName: "Ola",
        lastName: "Kucharczyk",
        username: "ola_user",
        email: "ola@example.com",
        createdAt: "2025-02-18",
        role: "USER",
    });

    const [editedUser, setEditedUser] = useState(user);

    useEffect(() => {
        setEditedUser(user);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // tu później dodasz zapytanie PUT do API
        console.log("Zapisano dane użytkownika:", editedUser);
        alert("Dane zostały zaktualizowane!");
    };

    return (
        <div className="account-page">
            <Navbar role="user" />

            <div className="account-container">
                <h2>Twoje konto</h2>
                <form className="account-form">
                    <label>Imię</label>
                    <input
                        type="text"
                        name="firstName"
                        value={editedUser.firstName}
                        onChange={handleChange}
                    />

                    <label>Nazwisko</label>
                    <input
                        type="text"
                        name="lastName"
                        value={editedUser.lastName}
                        onChange={handleChange}
                    />

                    <label>Nazwa użytkownika</label>
                    <input
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleChange}
                    />

                    <label>E-mail</label>
                    <input
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                    />

                    <label>Data utworzenia konta</label>
                    <input type="text" value={user.createdAt} readOnly />

                    <label>Rola</label>
                    <input type="text" value={user.role} readOnly />

                    <button type="button" onClick={handleSave}>
                        Zapisz zmiany
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Account;
