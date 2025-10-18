import React from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "./UserList.css"; // 👈 nowy styl zamiast Account.css
import { FaTrashAlt, FaEdit, FaUserPlus } from "react-icons/fa";

const UserList = () => {
    const users = [
        { id: 1, username: "ela", role: "User" },
        { id: 2, username: "ula", role: "User" },
        { id: 3, username: "ala", role: "User" },
        { id: 4, username: "ola", role: "User" },
        { id: 5, username: "user123", role: "User" },
    ];

    return (
        <div className="userlist-page">
            {/* 🧭 NAVBAR */}
            <AdminNavbar />


            {/* 🧾 GŁÓWNA ZAWARTOŚĆ */}
            <div className="userlist-container">
                <div className="userlist-header">
                    <h4>Lista użytkowników</h4>
                    <button className="add-btn">
                        <FaUserPlus /> Dodaj użytkownika *czy to potrzebne
                    </button>
                </div>

                <table className="userlist-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa użytkownika</th>
                        <th>Rola</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.role}</td>
                            <td className="actions">
                                <FaEdit className="edit-icon" />
                                <FaTrashAlt className="delete-icon" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
