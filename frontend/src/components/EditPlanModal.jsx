import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import "./EditPlanModal.css";

const EditPlanModal = ({ plan, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: plan.name || "",
        note: plan.note || "",
        routineTime: plan.routineTime || "MORNING",
        productIds: plan.products ? plan.products.map((p) => p.id) : [],
    });

    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAllProducts();
                setAllProducts(res.data);
            } catch (err) {
                console.error("Błąd pobierania produktów:", err);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRemoveProduct = (id) => {
        setForm((prev) => ({
            ...prev,
            productIds: prev.productIds.filter((pid) => pid !== id),
        }));
    };

    const handleAddProduct = (id) => {
        setForm((prev) => ({
            ...prev,
            productIds: prev.productIds.includes(id)
                ? prev.productIds
                : [...prev.productIds, id],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    // 🔎 filtrowanie produktów po nazwie
    const filteredProducts = allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-large">
                <h2>Edytuj plan pielęgnacyjny</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nazwa planu</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Notatka</label>
                    <textarea
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                    />

                    <label>Pora dnia</label>
                    <select
                        name="routineTime"
                        value={form.routineTime}
                        onChange={handleChange}
                    >
                        <option value="MORNING">Poranna</option>
                        <option value="EVENING">Wieczorna</option>
                        <option value="ANY">Uniwersalna</option>
                    </select>

                    <h3>Aktualne produkty w planie:</h3>
                    <div className="product-grid current-products">
                        {form.productIds.length === 0 ? (
                            <p>Brak produktów w planie.</p>
                        ) : (
                            form.productIds.map((id) => {
                                const p = allProducts.find((prod) => prod.id === id);
                                if (!p) return null;
                                return (
                                    <div key={id} className="product-card">
                                        <div className="product-info">
                                            <b>{p.name}</b> — {p.brand}
                                        </div>
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => handleRemoveProduct(id)}
                                        >
                                            ❌
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>


                    <h3>Dodaj nowe produkty:</h3>

                    {/* 🔍 Prosta wyszukiwarka */}
                    <input
                        type="text"
                        placeholder="Wpisz nazwę produktu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                                <div
                                    key={p.id}
                                    className={`product-option ${
                                        form.productIds.includes(p.id)
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => handleAddProduct(p.id)}
                                >
                                    <h4>{p.name}</h4>
                                    <p>{p.brand}</p>
                                </div>
                            ))
                        ) : (
                            <p>Brak produktów o takiej nazwie.</p>
                        )}
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="save-btn">
                            Zapisz zmiany
                        </button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPlanModal;
