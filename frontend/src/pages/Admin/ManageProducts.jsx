import React, { useState } from "react";
import AdminNavbar from "../../components/Navbar/AdminNavbar";
import "../../assets/styles/Account.css";
import "./ManageProducts.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const ManageProducts = () => {
    const products = [
        {
            id: 1,
            name: "Krem nawilżający Hydro Boost",
            brand: "Neutrogena",
            category: "moisturizer",
            target_sex: "female",
            use_time: "morning",
            is_vegan: true,
            is_cruelty_free: "unknown",
            is_eco_certified: false,
        },
        {
            id: 2,
            name: "Żel oczyszczający CeraVe",
            brand: "CeraVe",
            category: "cleanser",
            target_sex: "any",
            use_time: "any",
            is_vegan: false,
            is_cruelty_free: true,
            is_eco_certified: true,
        },
    ];

    const [filters, setFilters] = useState({
        name: "",
        brand: "",
        category: "",
        use_time: "",
        target_sex: "",
        is_vegan: "",
        is_cruelty_free: "",
        is_eco_certified: "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value === filters[name] ? "" : value,
        }));
    };

    const filteredProducts = products.filter((p) => {
        return (
            (filters.name === "" ||
                p.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.brand === "" ||
                p.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
            (filters.category === "" ||
                p.category.toLowerCase().includes(filters.category.toLowerCase())) &&
            (filters.use_time === "" || p.use_time === filters.use_time) &&
            (filters.target_sex === "" || p.target_sex === filters.target_sex) &&
            (filters.is_vegan === "" ||
                String(p.is_vegan) === String(filters.is_vegan)) &&
            (filters.is_cruelty_free === "" ||
                String(p.is_cruelty_free) === String(filters.is_cruelty_free)) &&
            (filters.is_eco_certified === "" ||
                String(p.is_eco_certified) === String(filters.is_eco_certified))
        );
    });

    const renderIcon = (value) => {
        if (value === true) return <span className="icon-true">✓</span>;
        if (value === false) return <span className="icon-false">✗</span>;
        return <span className="icon-unknown">?</span>;
    };

    return (
        <div className="manage-products-page">
            <AdminNavbar />

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
                    <input
                        type="text"
                        name="category"
                        placeholder="Kategoria"
                        value={filters.category}
                        onChange={handleFilterChange}
                    />

                    <label>Pora dnia</label>
                    <select
                        name="use_time"
                        value={filters.use_time}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszystkie</option>
                        <option value="morning">Poranna</option>
                        <option value="evening">Wieczorna</option>
                        <option value="any">Dowolna</option>
                    </select>

                    <label>Dla kogo</label>
                    <select
                        name="target_sex"
                        value={filters.target_sex}
                        onChange={handleFilterChange}
                    >
                        <option value="">Wszystkie</option>
                        <option value="female">Kobieta</option>
                        <option value="male">Mężczyzna</option>
                        <option value="any">Unisex</option>
                    </select>

                    {/* Sekcja radiobuttonów */}
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

                {/* Prawa sekcja - tabela */}
                <main className="products-content">
                    <div className="header-section">
                        <h1>Zarządzaj produktami</h1>
                        <button
                            className="add-btn"
                            onClick={() => (window.location.href = "/admin/add-product")}
                        >
                            <FaPlus /> Dodaj produkt
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
                                <td>{p.name}</td>
                                <td>{p.brand}</td>
                                <td>{p.category}</td>
                                <td>
                                    {p.target_sex === "any"
                                        ? "Unisex"
                                        : p.target_sex === "female"
                                            ? "Kobieta"
                                            : "Mężczyzna"}
                                </td>
                                <td>{p.use_time}</td>
                                <td>{renderIcon(p.is_vegan)}</td>
                                <td>{renderIcon(p.is_cruelty_free)}</td>
                                <td>{renderIcon(p.is_eco_certified)}</td>
                                <td className="actions">
                                    <FaEdit className="edit-icon" title="Edytuj" />
                                    <FaTrashAlt className="delete-icon" title="Usuń" />
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
