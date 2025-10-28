import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/AdminNavbar";
import productService from "../../services/productService";
import "./ProductDetails.css"; // używamy tego samego stylu co user

const AdminProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // 🔹 Mapy tłumaczeń dla enumów
    const sexLabels = {
        FEMALE: "Kobieta",
        MALE: "Mężczyzna",
        ALL: "Unisex",
    };

    const useTimeLabels = {
        MORNING: "Poranna",
        EVENING: "Wieczorna",
        ANY: "Dowolna",
    };

    // 🔹 Ikony logiczne
    const renderIcon = (value) => {
        if (value === true) return <span className="icon-true">✓</span>;
        if (value === false) return <span className="icon-false">✗</span>;
        return <span className="icon-unknown">•</span>;
    };

    // 🔹 Pobieranie danych produktu
    useEffect(() => {
        setLoading(true);
        productService
            .getProductById(id)
            .then((response) => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd podczas pobierania produktu:", err);
                setError(true);
                setLoading(false);
            });
    }, [id]);

    // 🔹 Usuwanie produktu
    const handleDelete = async () => {
        if (window.confirm("Czy na pewno chcesz usunąć ten produkt?")) {
            try {
                await productService.deleteProduct(id);
                alert("Produkt został usunięty.");
                navigate("/admin/products");
            } catch (error) {
                console.error("Błąd podczas usuwania produktu:", error);
                alert("Nie udało się usunąć produktu.");
            }
        }
    };

    if (loading) {
        return (
            <div className="product-details">
                <Navbar role="admin" />
                <div className="product-details-container">
                    <p>Ładowanie produktu...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-details">
                <Navbar role="admin" />
                <div className="product-details-container">
                    <p>Nie znaleziono produktu.</p>
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Wróć
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-details">
            <Navbar role="admin" />
            <div className="product-details-container">
                <div className="details-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Wróć
                    </button>

                    <div className="admin-actions">
                        <button
                            className="edit-btn"
                            onClick={() => navigate(`/admin/products/${id}/edit`)}
                        >
                             Edytuj
                        </button>
                        <button className="delete-btn" onClick={handleDelete}>
                             Usuń
                        </button>
                    </div>
                </div>

                <h1>{product.name}</h1>
                <p className="brand">{product.brand}</p>
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>

                {/* Sekcja głównych informacji */}
                <div className="product-info">
                    <p>
                        <strong>Dla kogo:</strong> {sexLabels[product.targetSex] || "—"}
                    </p>
                    <p>
                        <strong>Pora dnia:</strong> {useTimeLabels[product.useTime] || "—"}
                    </p>
                    <p>
                        <strong>Wegański:</strong> {renderIcon(product.isVegan)}
                    </p>
                    <p>
                        <strong>Cruelty-free:</strong> {renderIcon(product.isCrueltyFree)}
                    </p>
                    <p>
                        <strong>Eko:</strong> {renderIcon(product.isEcoCertified)}
                    </p>
                    {product.notRecommendedDuringPregnancy && (
                        <p className="warning">⚠️ Nie zalecany w okresie ciąży</p>
                    )}
                </div>

                {/* Sekcja typów skóry */}
                {product.skinTypes && product.skinTypes.length > 0 && (
                    <div className="skin-types">
                        <h3>Typy skóry</h3>
                        <ul>
                            {product.skinTypes.map((type, i) => (
                                <li key={i}>
                                    {type === "DRY"
                                        ? "Sucha"
                                        : type === "SENSITIVE"
                                            ? "Wrażliwa"
                                            : type === "COMBINATION"
                                                ? "Mieszana"
                                                : type === "OILY"
                                                    ? "Tłusta"
                                                    : type}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Sekcja składników */}
                {product.ingredients && product.ingredients.length > 0 && (
                    <div className="ingredients">
                        <h3>Skład (INCI)</h3>
                        <p>{product.ingredients.join(", ")}</p>
                    </div>
                )}

                {/* Sekcja efektów działania */}
                {product.goals && product.goals.length > 0 && (
                    <div className="goals">
                        <h3>Efekty działania</h3>
                        <ul>
                            {product.goals.map((goal, i) => (
                                <li key={i}>{goal}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProductDetails;
