import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "./UserList.css";
import { FaTrashAlt } from "react-icons/fa";
import { getAllUsers, deleteUser } from "../../services/userService";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                setMessage("Błąd pobierania użytkowników");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć tego użytkownika?");
        if (!confirmDelete) return;

        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setMessage(" Użytkownik został usunięty.");
        } catch (error) {
            setMessage(" Nie udało się usunąć użytkownika.");
        }
    };

    if (loading) return <p>Ładowanie danych...</p>;

    return (
        <div className="userlist-page">
            <AdminNavbar />

            <div className="userlist-container">
                <div className="userlist-header">
                    <h4>Lista użytkowników</h4>
                </div>

                {message && <p className="userlist-message">{message}</p>}

                <table className="userlist-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nazwa użytkownika</th>
                        <th>E-mail</th>
                        <th>Provider</th>
                        <th>Rola</th>
                        <th>Data utworzenia</th>
                        <th>Ostatnia aktualizacja</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.provider}</td>
                                <td>{u.role}</td>
                                <td>{new Date(u.createdAt).toLocaleDateString("pl-PL")}</td>
                                <td>{new Date(u.updatedAt).toLocaleDateString("pl-PL")}</td>
                                <td className="actions">
                                    <FaTrashAlt
                                        className="delete-icon"
                                        onClick={() => handleDelete(u.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: "center", color: "gray" }}>
                                Brak użytkowników do wyświetlenia.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
