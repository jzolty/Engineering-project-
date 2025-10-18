import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/UserNavbar";
import "./ProductDetails.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Tymczasowe dane testowe (później zastąpisz backendem)
    const products = [
        {
            id: 1,
            name: "Krem nawilżający Hydro Boost",
            brand: "Neutrogena",
            category: "moisturizer",
            description:
                "Lekki krem-żel zapewniający intensywne nawilżenie przez 24 godziny.",
            target_sex: "female",
            use_time: "morning",
            is_vegan: true,
            is_cruelty_free: "unknown",
            is_eco_certified: false,
            ingredients:
                "Purified Water, Glycerin, Sodium Hyaluronate, Dimethicone, Cetearyl Alcohol...",
        },
        {
            id: 2,
            name: "Żel oczyszczający CeraVe",
            brand: "CeraVe",
            category: "cleanser",
            description:
                "Delikatny żel myjący z ceramidami i niacynamidem, odpowiedni do skóry wrażliwej.",
            target_sex: "any",
            use_time: "any",
            is_vegan: false,
            is_cruelty_free: true,
            is_eco_certified: true,
            ingredients:
                "Aqua, Glycerin, Sodium Lauroyl Sarcosinate, Ceramide NP, Niacinamide...",
        },
    ];

    const product = products.find((p) => p.id === Number(id));

    if (!product) {
        return (
            <div className="product-details">
                <Navbar role="user" />
                <div className="product-details-container">
                    <p>Nie znaleziono produktu.</p>
                </div>
            </div>
        );
    }

    const renderIcon = (value) => {
        if (value === true) return <span className="icon-true">✓</span>;
        if (value === false) return <span className="icon-false">✗</span>;
        return <span className="icon-unknown">?</span>;
    };

    return (
        <div className="product-details">
            <Navbar role="user" />
            <div className="product-details-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Wróć
                </button>

                <h1>{product.name}</h1>
                <p className="brand">{product.brand}</p>
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>

                <div className="product-info">
                    <p>
                        <strong>Dla kogo:</strong>{" "}
                        {product.target_sex === "female"
                            ? "Kobieta"
                            : product.target_sex === "male"
                                ? "Mężczyzna"
                                : "Unisex"}
                    </p>
                    <p>
                        <strong>Pora dnia:</strong> {product.use_time}
                    </p>
                    <p>
                        <strong>Wegański:</strong> {renderIcon(product.is_vegan)}
                    </p>
                    <p>
                        <strong>Cruelty-free:</strong> {renderIcon(product.is_cruelty_free)}
                    </p>
                    <p>
                        <strong>Eko:</strong> {renderIcon(product.is_eco_certified)}
                    </p>
                </div>

                <div className="ingredients">
                    <h3>Skład (INCI)</h3>
                    <p>{product.ingredients}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
