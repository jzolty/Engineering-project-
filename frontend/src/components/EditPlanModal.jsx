import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import "./EditPlanModal.css";

const categoryLabels = {
    CREAM: "Krem",
    SERUM: "Serum",
    TONER: "Tonik",
    SPF: "Filtr przeciwsłoneczny",
    CLEANSER: "Preparat oczyszczający",
    MASK: "Maseczka",
    MICELLAR_WATER: "Płyn micelarny",
    EYE_CREAM: "Krem pod oczy",
    OTHER: "Inny produkt",
};

const EditPlanModal = ({ plan, onClose, onSave }) => {
    const [form, setForm] = useState({
        name: plan.name || "",
        note: plan.note || "",
        routineTime: plan.routineTime || "MORNING",
        // ✅ poprawione mapowanie na p.product.id
        productIds: plan.products ? plan.products.map((p) => p.product.id) : [],
    });

    const [allProducts, setAllProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // 🔹 Pobierz wszystkie produkty
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

    // 🔹 Obsługa zmiany pól formularza
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Usunięcie produktu z potwierdzeniem
    const handleRemoveProduct = (id) => {
        const product = allProducts.find((p) => p.id === id);
        if (
            window.confirm(
                `Czy na pewno chcesz usunąć produkt "${product?.name || "ten produkt"}" z planu?`
            )
        ) {
            setForm((prev) => ({
                ...prev,
                productIds: prev.productIds.filter((pid) => pid !== id),
            }));
        }
    };

    // 🔹 Dodanie nowego produktu do planu
    const handleAddProduct = (id) => {
        setForm((prev) => ({
            ...prev,
            productIds: prev.productIds.includes(id)
                ? prev.productIds
                : [...prev.productIds, id],
        }));
    };

    // 🔹 Zapis zmian
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    // 🔍 Filtrowanie produktów po nazwie
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

                    {/* 🔹 Sekcja aktualnych produktów */}
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
                                            <br />
                                            <span className="product-category">
            {categoryLabels[p.category] || p.category}
        </span>
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

                    {/* 🔹 Sekcja dodawania nowych produktów */}
                    <h3>Dodaj nowe produkty:</h3>
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
                                    <span className="product-category">
    {categoryLabels[p.category] || p.category}
</span>

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
