import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "./ManageRules.css";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { getAllRules, getAllIngredients, addRule, updateRule, deleteRule } from "../../services/ruleService";

const ManageRules = () => {
    const [rules, setRules] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [newRule, setNewRule] = useState({
        ingredientAId: "",
        ingredientBId: "",
        ruleType: "BENEFICIAL",
        points: 0,
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rulesData, ingredientsData] = await Promise.all([
                    getAllRules(),
                    getAllIngredients(),
                ]);
                setRules(rulesData);
                setIngredients(ingredientsData);
            } catch (error) {
                setMessage("❌ Błąd pobierania danych.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddRule = async () => {
        try {
            if (!newRule.ingredientAId || !newRule.ingredientBId) {
                alert("Wybierz dwa różne składniki!");
                return;
            }
            if (newRule.ingredientAId === newRule.ingredientBId) {
                alert("Nie można wybrać dwóch takich samych składników!");
                return;
            }
            const createdRule = await addRule(newRule);
            setRules((prev) => [...prev, createdRule]);
            setNewRule({ ingredientAId: "", ingredientBId: "", ruleType: "BENEFICIAL", points: 0 });
            setMessage("✅ Reguła została dodana.");
        } catch (error) {
            setMessage("❌ " + (error.response?.data?.message || "Nie udało się dodać reguły."));
        }
    };

    const handleEditRule = async (id, updatedRule) => {
        try {
            await updateRule(id, updatedRule);
            setRules((prev) =>
                prev.map((r) => (r.id === id ? { ...r, ...updatedRule } : r))
            );
            setMessage("✅ Zaktualizowano regułę.");
        } catch (error) {
            setMessage("❌ Nie udało się zaktualizować reguły.");
        }
    };

    const handleDeleteRule = async (id) => {
        const confirmDelete = window.confirm("Czy na pewno chcesz usunąć tę regułę?");
        if (!confirmDelete) return;

        try {
            await deleteRule(id);
            setRules((prev) => prev.filter((r) => r.id !== id));
            setMessage("🗑️ Reguła została usunięta.");
        } catch (error) {
            setMessage("❌ Błąd usuwania reguły.");
        }
    };

    const translateType = (type) => {
        switch (type) {
            case "BENEFICIAL":
                return "Korzyść";
            case "HARMFUL":
                return "Szkodliwa interakcja";
            default:
                return type;
        }
    };

    if (loading) return <p>Ładowanie danych...</p>;

    return (
        <div className="manage-rules-page">
            <AdminNavbar />

            <div className="manage-rules-container">
                <div className="header-section">
                    <h2>Zarządzaj regułami rekomendacji</h2>
                </div>

                {message && <p className="manage-rules-message">{message}</p>}

                {/* Formularz dodawania reguły */}
                <div className="add-rule-section">
                    <h4>Dodaj nową regułę</h4>
                    <div className="add-rule-form">
                        <select
                            value={newRule.ingredientAId}
                            onChange={(e) => setNewRule({ ...newRule, ingredientAId: e.target.value })}
                        >
                            <option value="">Składnik A</option>
                            {ingredients.map((ing) => (
                                <option key={ing.id} value={ing.id}>
                                    {ing.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={newRule.ingredientBId}
                            onChange={(e) => setNewRule({ ...newRule, ingredientBId: e.target.value })}
                        >
                            <option value="">Składnik B</option>
                            {ingredients.map((ing) => (
                                <option key={ing.id} value={ing.id}>
                                    {ing.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={newRule.ruleType}
                            onChange={(e) => setNewRule({ ...newRule, ruleType: e.target.value })}
                        >
                            <option value="BENEFICIAL">Korzyść</option>
                            <option value="HARMFUL">Szkodliwa interakcja</option>
                        </select>

                        <input
                            type="number"
                            value={newRule.points}
                            onChange={(e) => setNewRule({ ...newRule, points: parseInt(e.target.value) })}
                            placeholder="Punkty"
                        />

                        <button className="add-btn" onClick={handleAddRule}>
                            <FaPlus /> Dodaj regułę
                        </button>
                    </div>
                </div>

                {/* Tabela reguł */}
                <div className="rules-table-wrapper">
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
                        {rules.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", color: "gray" }}>
                                    Brak zdefiniowanych reguł.
                                </td>
                            </tr>
                        ) : (
                            rules.map((rule) => (
                                <tr key={rule.id}>
                                    <td>{rule.ingredientA}</td>
                                    <td>{rule.ingredientB}</td>
                                    <td>
                                        <select
                                            value={rule.ruleType}
                                            onChange={(e) =>
                                                handleEditRule(rule.id, { ...rule, ruleType: e.target.value })
                                            }
                                            className="rule-type-dropdown"
                                        >
                                            <option value="BENEFICIAL">Korzyść</option>
                                            <option value="HARMFUL">Szkodliwa interakcja</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={rule.points}
                                            onChange={(e) =>
                                                handleEditRule(rule.id, { ...rule, points: parseInt(e.target.value) })
                                            }
                                            className="points-input"
                                        />
                                    </td>
                                    <td className="actions">
                                        <FaTrashAlt
                                            className="delete-icon"
                                            onClick={() => handleDeleteRule(rule.id)}
                                            title="Usuń regułę"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageRules;
