import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import "./Recommendations.css";

const Recommendations = () => {
    const recommendations = [
        {
            id: 1,
            date: "2025-10-15",
            routineTime: "Poranna rutyna",
            reasons: ["Skóra tłusta", "Cera trądzikowa"],
            products: [
                { name: "Żel oczyszczający CeraVe", brand: "CeraVe", category: "cleanser" },
                { name: "Serum z niacynamidem 10%", brand: "The Ordinary", category: "serum" },
                { name: "Krem nawilżający Hydro Boost", brand: "Neutrogena", category: "moisturizer" },
                { name: "Krem SPF 50+", brand: "La Roche-Posay", category: "spf" },
            ],
        },
        {
            id: 2,
            date: "2025-10-10",
            routineTime: "Wieczorna rutyna",
            reasons: ["Cera sucha", "Wrażliwa"],
            products: [
                { name: "Mleczko do demakijażu", brand: "Bioderma", category: "cleanser" },
                { name: "Krem lipidowy", brand: "Emolium", category: "moisturizer" },
            ],
        },
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // sortowanie malejąco po dacie

    const [selected, setSelected] = useState(recommendations[0]);

    return (
        <div className="recommendations-page">
            <Navbar role="user" />

            <div className="recommendations-wrapper">
                {/* Lewy panel – lista rekomendacji */}
                <div className="recommendations-sidebar">
                    <h2>Ostatnie rekomendacje</h2>
                    <ul>
                        {recommendations.map((rec) => (
                            <li
                                key={rec.id}
                                className={selected.id === rec.id ? "active" : ""}
                                onClick={() => setSelected(rec)}
                            >
                                <div className="rec-title">{rec.routineTime}</div>
                                <div className="rec-date">{rec.date}</div>
                                <div className="rec-preview">
                                    {rec.reasons.slice(0, 2).join(", ")}...
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Prawy panel – szczegóły */}
                <div className="recommendations-details">
                    {selected ? (
                        <>
                            <h1>{selected.routineTime}</h1>
                            <p className="recommendation-date">
                                <b>Data:</b> {selected.date}
                            </p>
                            <p>
                                <b>Powody:</b> {selected.reasons.join(", ")}
                            </p>

                            <div className="products-list">
                                {selected.products.map((p, i) => (
                                    <div key={i} className="product-item">
                                        <p>
                                            <b>{p.name}</b> — {p.brand} <span>({p.category})</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>Wybierz rekomendację z listy po lewej stronie.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
