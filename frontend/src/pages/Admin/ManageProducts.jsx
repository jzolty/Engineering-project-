import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/AdminNavbar";
import productService from "../../services/productService";
import "./ManageProducts.css";
import { useNavigate } from "react-router-dom";

const ManageProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        brand: "",
        use_time: "",
        target_sex: "",
        is_vegan: "",
        is_cruelty_free: "",
        is_eco_certified: "",
    });
    const [selectedCategories, setSelectedCategories] = useState([]);

    // 🔹 Mapy tłumaczeń
    const sexLabels = {
        FEMALE: "Kobieta",
        MALE: "Mężczyzna",
        ALLSEX: "Unisex",
    };

    const useTimeLabels = {
        MORNING: "Poranna",
        EVENING: "Wieczorna",
        ANY: "Dowolna",
    };

    const categoryLabels = {
        CLEANSER: "Preparat oczyszczający",
        SERUM: "Serum",
        TONER: "Tonik",
        CREAM: "Krem",
        MASK: "Maseczka",
        SPF: "Filtr przeciwsłoneczny",
        EYE_CREAM: "Krem pod oczy",
        MICELLAR_WATER: "Płyn micelarny",
        OTHER: "Inny produkt",
    };

    // 🔹 Pobranie produktów
    useEffect(() => {
        productService
            .getAllProducts()
            .then((res) => setProducts(res.data))
            .catch((err) =>
                console.error("Błąd podczas pobierania produktów:", err)
            );
    }, []);

    // 🔹 Obsługa filtrów
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value === filters[name] ? "" : value,
        }));
    };

    // 🔹 Filtrowanie produktów
    const filteredProducts = products.filter((p) => {
        return (
            (filters.name === "" ||
                p.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.brand === "" ||
                p.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
            (selectedCategories.length === 0 ||
                selectedCategories.includes(p.category)) &&
            (filters.use_time === "" || p.useTime === filters.use_time) &&
            (filters.target_sex === "" || p.targetSex === filters.target_sex) &&
            (filters.is_vegan === "" ||
                String(p.isVegan) === String(filters.is_vegan)) &&
            (filters.is_cruelty_free === "" ||
                String(p.isCrueltyFree) === String(filters.is_cruelty_free)) &&
            (filters.is_eco_certified === "" ||
                String(p.isEcoCertified) === String(filters.is_eco_certified))
        );
    });

    // 🔹 Ikony logiczne
    const renderIcon = (value) => {
        if (value === true) return <span className="icon-true">✓</span>;
        if (value === false) return <span className="icon-false">✗</span>;
        return <span className="icon-unknown">•</span>;
    };

    // 🔹 Usuwanie produktu
    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten produkt?")) return;
        try {
            await productService.deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            alert("Produkt został usunięty.");
        } catch (err) {
            console.error("Błąd podczas usuwania produktu:", err);
            alert("Nie udało się usunąć produktu.");
        }
    };

    return (
        <div className="manage-products-page">
            <Navbar role="admin" />

            <div className="products-wrapper">
                {/* Lewy panel filtrów */}
                <aside className="filters-panel">
                    <h2>Filtry</h2>
                    <p>Wybierz swoje preferencje:</p>

                    <input
                        type="text"
                        name="name"
                        placeholder="Nazwa produktu"
                        value={filters.name}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="text"
                        name="brand"
                        placeholder="Marka"
                        value={filters.brand}
                        onChange={handleFilterChange}
                    />

                    <label>Kategorie</label>
                    <div className="checkbox-category-group">
                        {Object.entries(categoryLabels).map(([key, label]) => (
                            <label key={key} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={key}
                                    checked={selectedCategories.includes(key)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCategories((prev) => [...prev, key]);
                                        } else {
                                            setSelectedCategories((prev) =>
                                                prev.filter((cat) => cat !== key)
                                            );
                                        }
                                    }}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>

                    <label>Pora dnia</label>
                    <select
                        name="use_time"
                        value={filters.use_time}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszystkie</option>
                        <option value="MORNING">Poranna</option>
                        <option value="EVENING">Wieczorna</option>
                        <option value="ANY">Dowolna</option>
                    </select>

                    <label>Dla kogo</label>
                    <select
                        name="target_sex"
                        value={filters.target_sex}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszystkie</option>
                        <option value="FEMALE">Kobieta</option>
                        <option value="MALE">Mężczyzna</option>
                        <option value="ALL">Unisex</option>
                    </select>

                    <div className="radio-section">
                        {[
                            { name: "is_vegan", label: "Wegański" },
                            { name: "is_cruelty_free", label: "Cruelty-free" },
                            { name: "is_eco_certified", label: "Eko" },
                        ].map((filter) => (
                            <div key={filter.name} className="radio-group">
                                <label className="radio-title">{filter.label}</label>
                                <div className="radio-options">
                                    <label>
                                        <input
                                            type="radio"
                                            name={filter.name}
                                            value="true"
                                            checked={filters[filter.name] === "true"}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="icon-true">✓</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={filter.name}
                                            value="false"
                                            checked={filters[filter.name] === "false"}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="icon-false">✗</span>
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name={filter.name}
                                            value=""
                                            checked={filters[filter.name] === ""}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="icon-unknown">•</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Prawy panel - lista produktów */}
                <main className="products-content">
                    <div className="header-admin">
                        <h1>Zarządzaj produktami</h1>
                        <button
                            className="add-btn"
                            onClick={() => navigate("/admin/products/add")}
                        >
                            + Dodaj nowy produkt
                        </button>
                    </div>

                    <table className="products-table">
                        <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Marka</th>
                            <th>Kategoria</th>
                            <th>Dla kogo</th>
                            <th>Pora dnia</th>
                            <th>Wegański</th>
                            <th>Cruelty-free</th>
                            <th>Eko</th>
                            <th>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((p) => (
                            <tr key={p.id}>
                                <td
                                    className="product-link"
                                    onClick={() =>
                                        navigate(`/admin/products/${p.id}`)
                                    }
                                >
                                    {p.name}
                                </td>
                                <td>{p.brand}</td>
                                <td>{categoryLabels[p.category] || p.category}</td>
                                <td>{sexLabels[p.targetSex] || p.targetSex}</td>
                                <td>{useTimeLabels[p.useTime] || p.useTime}</td>
                                <td>{renderIcon(p.isVegan)}</td>
                                <td>{renderIcon(p.isCrueltyFree)}</td>
                                <td>{renderIcon(p.isEcoCertified)}</td>
                                <td className="actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            navigate(`/admin/products/${p.id}/edit`)
                                        }
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    );
};

export default ManageProducts;
