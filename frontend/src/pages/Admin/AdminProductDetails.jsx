import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/AdminNavbar";
import productService from "../../services/productService";
import "./ProductDetails.css";

const enumLabels = {
    category: {
        CLEANSER: "Preparat oczyszczający",
        SERUM: "Serum",
        TONER: "Tonik",
        CREAM: "Krem",
        MASK: "Maseczka",
        SPF: "Filtr przeciwsłoneczny",
        EYE_CREAM: "Krem pod oczy",
        MICELLAR_WATER: "Płyn micelarny",
        OTHER: "Inny produkt",
    },
    sex: {
        FEMALE: "Kobieta",
        MALE: "Mężczyzna",
        ALL: "Unisex",
        ALLSEX: "Dowolna płeć",
    },
    useTime: {
        MORNING: "Poranna",
        EVENING: "Wieczorna",
        ANY: "Dowolna",
    },
};

const AdminProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const renderIcon = (value) => {
        if (value === true) return <span className="icon-true">✓</span>;
        if (value === false) return <span className="icon-false">✗</span>;
        return <span className="icon-unknown">•</span>;
    };

    useEffect(() => {
        setLoading(true);
        productService
            .getProductById(id)
            .then((res) => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Błąd pobierania produktu:", err);
                setError(true);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Na pewno usunąć ten produkt?")) return;
        try {
            await productService.deleteProduct(id);
            alert("Produkt został usunięty.");
            navigate("/admin/manage-products");
        } catch (err) {
            console.error("Błąd usuwania produktu:", err);
            alert("Nie udało się usunąć produktu.");
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

    const categoryLabel =
        enumLabels.category[product.category] || product.category;
    const sexLabel = enumLabels.sex[product.targetSex] || product.targetSex;
    const useTimeLabel =
        enumLabels.useTime[product.useTime] || product.useTime;

    return (
        <div className="product-details">
            <Navbar role="admin" />
            <div className="product-details-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Wróć
                </button>

                <h1>{product.name}</h1>
                <p className="brand">{product.brand}</p>
                <p className="category">{categoryLabel}</p>
                <p className="description">{product.description}</p>

                {/* Pasek głównych info */}
                <div className="product-info">
                    <p>
                        <strong>Dla kogo:</strong> {sexLabel || "—"}
                    </p>
                    <p>
                        <strong>Pora dnia:</strong> {useTimeLabel || "—"}
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
                        <p className="warning">Nie zalecany w okresie ciąży</p>
                    )}
                </div>

                {/* Typy skóry */}
                {product.skinTypes && product.skinTypes.length > 0 && (
                    <div className="skin-types">
                        <h3>Typy skóry</h3>
                        <ul>
                            {product.skinTypes.map((type, i) => {
                                const map = {
                                    DRY: "Sucha",
                                    OILY: "Tłusta",
                                    SENSITIVE: "Wrażliwa",
                                    COMBINATION: "Mieszana",
                                    NORMAL: "Normalna",
                                    MATURE_SKIN: "Dojrzała skóra",
                                };
                                return <li key={i}>{map[type] || type}</li>;
                            })}
                        </ul>
                    </div>
                )}

                {/* Składniki */}
                {product.ingredients && product.ingredients.length > 0 && (
                    <div className="ingredients">
                        <h3>Skład (INCI)</h3>
                        <ul>
                            {product.ingredients.map((ing, i) => (
                                <li key={i}>{ing.name || ing}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Efekty działania */}
                {product.goals && product.goals.length > 0 && (
                    <div className="goals">
                        <h3>Efekty działania</h3>
                        <ul>
                            {product.goals.map((g, i) => (
                                <li key={i}>{g.name || g}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="admin-actions">
                    <button
                        className="edit-btn"
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    >
                        Edytuj
                    </button>
                    <button className="delete-btn" onClick={handleDelete}>
                        Usuń
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductDetails;
