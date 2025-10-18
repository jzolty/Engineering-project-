import React, { useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "../../assets/styles/Account.css";
import "./ManageRules.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const ManageRules = () => {
    const [rules, setRules] = useState([
        {
            id: 1,
            ingredientA: "Niacinamide",
            ingredientB: "Retinol",
            ruleType: "CONFLICT",
            points: -2,
        },
        {
            id: 2,
            ingredientA: "Ceramide NP",
            ingredientB: "Niacinamide",
            ruleType: "BENEFICIAL",
            points: 2,
        },
        {
            id: 3,
            ingredientA: "Vitamin C",
            ingredientB: "Niacinamide",
            ruleType: "SYNERGY",
            points: 3,
        },
    ]);

    return (
        <div className="manage-rules-page">
            <AdminNavbar />

            <div className="manage-rules-container">
                <div className="header-section">
                    <h2>Zarządzaj regułami rekomendacji</h2>
                    <button className="add-btn">
                        <FaPlus /> Dodaj regułę
                    </button>
                </div>

                <table className="rules-table">
                    <thead>
                    <tr>
                        <th>Składnik A</th>
                        <th>Składnik B</th>
                        <th>Typ relacji</th>
                        <th>Punkty</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rules.map((rule) => (
                        <tr key={rule.id}>
                            <td>{rule.ingredientA}</td>
                            <td>{rule.ingredientB}</td>
                            <td>
                                <select className="rule-type-dropdown" defaultValue={rule.ruleType}>
                                    <option value="BENEFICIAL">Beneficial</option>
                                    <option value="HARMFUL">Harmful</option>
                                    <option value="SYNERGY">Synergy</option>
                                    <option value="CONFLICT">Conflict</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    defaultValue={rule.points}
                                    className="points-input"
                                />
                            </td>
                            <td className="actions">
                                <FaEdit className="edit-icon" title="Zapisz zmiany" />
                                <FaTrashAlt className="delete-icon" title="Usuń regułę" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageRules;
