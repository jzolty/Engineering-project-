import React, { useState, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import "./Products.css";

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Tymczasowe dane testowe (później pobierane z API)
    useEffect(() => {
        setProducts([
            {
                id: 1,
                name: "Krem nawilżający Hydro Boost",
                brand: "Neutrogena",
                category: "moisturizer",
                use_time: "morning",
                target_sex: "female",
                is_vegan: "true",
                is_cruelty_free: "unknown",
                is_eco_certified: "false",
                created_at: "2025-05-10",
            },
            {
                id: 2,
                name: "Żel oczyszczający CeraVe",
                brand: "CeraVe",
                category: "cleanser",
                use_time: "any",
                target_sex: "unisex",
                is_vegan: "false",
                is_cruelty_free: "true",
                is_eco_certified: "true",
                created_at: "2025-04-28",
            },
        ]);
    }, []);

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);

        setProducts((prev) =>
            [...prev].sort((a, b) => {
                if (a[field] < b[field]) return order === "asc" ? -1 : 1;
                if (a[field] > b[field]) return order === "asc" ? 1 : -1;
                return 0;
            })
        );
    };

    const handleSelect = (product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="products-page">
            <Navbar role="user" />

            <div className="products-container">
                <div className="products-header">
                    <h1>Przeglądaj produkty</h1>
                    <p>Filtruj i sortuj kosmetyki według swoich preferencji.</p>
                </div>

                <div className="products-table">
                    <table>
                        <thead>
                        <tr>
                            <th onClick={() => handleSort("name")}>Nazwa</th>
                            <th onClick={() => handleSort("brand")}>Marka</th>
                            <th onClick={() => handleSort("category")}>Kategoria</th>
                            <th onClick={() => handleSort("use_time")}>Pora dnia</th>
                            <th onClick={() => handleSort("is_vegan")}>Wegański</th>
                            <th onClick={() => handleSort("is_cruelty_free")}>Cruelty-free</th>
                            <th onClick={() => handleSort("is_eco_certified")}>Eko</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((p) => (
                            <tr key={p.id} onClick={() => handleSelect(p)}>
                                <td>{p.name}</td>
                                <td>{p.brand}</td>
                                <td>{p.category}</td>
                                <td>{p.use_time}</td>
                                <td>{p.is_vegan}</td>
                                <td>{p.is_cruelty_free}</td>
                                <td>{p.is_eco_certified}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {selectedProduct && (
                    <div className="product-details">
                        <h2>{selectedProduct.name}</h2>
                        <p>
                            <b>Marka:</b> {selectedProduct.brand}
                        </p>
                        <p>
                            <b>Kategoria:</b> {selectedProduct.category}
                        </p>
                        <p>
                            <b>Pora dnia:</b> {selectedProduct.use_time}
                        </p>
                        <p>
                            <b>Wegański:</b> {selectedProduct.is_vegan}
                        </p>
                        <p>
                            <b>Cruelty-free:</b> {selectedProduct.is_cruelty_free}
                        </p>
                        <p>
                            <b>Eko:</b> {selectedProduct.is_eco_certified}
                        </p>

                        <h3>Skład (ingredients):</h3>
                        <ul>
                            <li>Kwas hialuronowy</li>
                            <li>Niacynamid</li>
                            <li>Gliceryna</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsList;
