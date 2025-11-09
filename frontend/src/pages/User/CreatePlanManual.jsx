import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/UserNavbar";
import productService from "../../services/productService";
import skincarePlanService from "../../services/skincarePlanService";
import { getCurrentUser } from "../../services/authService";
import "./CreatePlanManual.css";
import ProductSelector from "../../components/ProductSelector";

const CreatePlanManual = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
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
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [routineTime, setRoutineTime] = useState("MORNING");

    // 🔹 Pobierz zalogowanego użytkownika
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                alert("Sesja wygasła. Zaloguj się ponownie.");
                window.location.href = "/login";
                return;
            }
            setUser(currentUser);
        };
        fetchUser();
    }, []);

    // 🔹 Pobierz produkty
    useEffect(() => {
        productService.getAllProducts().then((res) => {
            setProducts(res.data);
        });
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value === prev[name] ? "" : value,
        }));
    };

    const filteredProducts = products.filter((p) => {
        return (
            (filters.name === "" ||
                p.name.toLowerCase().includes(filters.name.toLowerCase())) &&
            (filters.brand === "" ||
                p.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
            (filters.category === "" || p.category === filters.category) &&
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            alert("Nie udało się zidentyfikować użytkownika.");
            return;
        }

        if (selectedProducts.length === 0) {
            alert("Wybierz przynajmniej jeden produkt do planu.");
            return;
        }

        const payload = {
            name,
            note,
            source: "MANUAL",
            routineTime,
            productIds: selectedProducts.map((p) => p.id),
        };

        try {
            const saved = await skincarePlanService.createManualPlan(user.id, payload);
            console.log("Zapisany plan:", saved);
            alert("Plan pielęgnacyjny został zapisany!");
            navigate("/user/recommendations");
        } catch (err) {
            console.error("Błąd zapisu planu:", err);
            alert("Nie udało się zapisać planu. Sprawdź konsolę.");
        }
    };

    return (
        <div className="manual-plan-wrapper">
            <Navbar role="user" />
            <div className="manual-plan-container">
                <div className="manual-left">
                    <div className="manual-form">
                        <h1>Tworzenie planu pielęgnacyjnego</h1>
                        <p>Wybierz produkty, które chcesz dodać do swojej rutyny.</p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nazwa planu"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Notatka (opcjonalnie)"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />

                            <div className="time-switch">
                                <label>
                                    <input
                                        type="radio"
                                        value="MORNING"
                                        checked={routineTime === "MORNING"}
                                        onChange={() => setRoutineTime("MORNING")}
                                    />
                                    Poranna
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="EVENING"
                                        checked={routineTime === "EVENING"}
                                        onChange={() => setRoutineTime("EVENING")}
                                    />
                                    Wieczorna
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="ANY"
                                        checked={routineTime === "ANY"}
                                        onChange={() => setRoutineTime("ANY")}
                                    />
                                    Uniwersalna
                                </label>
                            </div>

                            <button type="submit" className="save-btn">
                                Zapisz plan
                            </button>
                        </form>
                    </div>

                    <div className="manual-filters">
                        <h3>Filtruj produkty</h3>
                        <ProductSelector
                            showFiltersOnly={true}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>

                <div className="manual-products">
                    <h2>Wybierz produkty</h2>
                    <div className="product-grid">
                        {filteredProducts.map((p) => (
                            <div
                                key={p.id}
                                className={`product-card ${
                                    selectedProducts.find((sel) => sel.id === p.id)
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {
                                    if (selectedProducts.find((sel) => sel.id === p.id)) {
                                        setSelectedProducts(
                                            selectedProducts.filter((sel) => sel.id !== p.id)
                                        );
                                    } else {
                                        setSelectedProducts([...selectedProducts, p]);
                                    }
                                }}
                            >
                                <h4>{p.name}</h4>
                                <p>{p.brand}</p>
                                <span>{p.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePlanManual;
