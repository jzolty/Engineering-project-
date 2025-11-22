import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/AdminNavbar";
import skincarePlanService from "../../services/skincarePlanService";
import "./ManagePlans.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const ManagePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [typeFilter, setTypeFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");


    const generateReport = () => {
        if (!plans || plans.length === 0) {
            alert("Brak danych do raportu.");
            return;
        }

        const doc = new jsPDF({
            encoding: "UTF-8",
        });

        // 🔹 Funkcja pomocnicza — usuwa polskie znaki diakrytyczne, żeby PDF nie miał „krzaków”
        const fixPL = (text) =>
            text
                .replaceAll("ą", "a")
                .replaceAll("ć", "c")
                .replaceAll("ę", "e")
                .replaceAll("ł", "l")
                .replaceAll("ń", "n")
                .replaceAll("ó", "o")
                .replaceAll("ś", "s")
                .replaceAll("ż", "z")
                .replaceAll("ź", "z")
                .replaceAll("Ą", "A")
                .replaceAll("Ć", "C")
                .replaceAll("Ę", "E")
                .replaceAll("Ł", "L")
                .replaceAll("Ń", "N")
                .replaceAll("Ó", "O")
                .replaceAll("Ś", "S")
                .replaceAll("Ż", "Z")
                .replaceAll("Ź", "Z");

        // 🔹 Nagłówek raportu
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(fixPL("Raport pielegnacyjny — podsumowanie systemu"), 14, 20);

        // 🔹 Data i godzina generowania raportu
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(fixPL(`Wygenerowano: ${formattedDate} o ${formattedTime}`), 14, 27);

        // 🔹 Statystyki raportu
        const totalPlans = plans.length;
        const manualPlans = plans.filter((p) => p.source === "MANUAL").length;
        const autoPlans = plans.filter((p) => p.source === "AUTO").length;
        const uniqueUsers = new Set(plans.map((p) => p.user?.username)).size;
        const avgPlansPerUser = (totalPlans / uniqueUsers).toFixed(2);

        const timeStats = plans.reduce((acc, p) => {
            acc[p.routineTime] = (acc[p.routineTime] || 0) + 1;
            return acc;
        }, {});
        const mostCommonTime = Object.entries(timeStats).sort((a, b) => b[1] - a[1])[0][0];

        const firstDate = new Date(
            Math.min(...plans.map((p) => new Date(p.createdAt)))
        ).toLocaleDateString();
        const lastDate = new Date(
            Math.max(...plans.map((p) => new Date(p.createdAt)))
        ).toLocaleDateString();

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(fixPL(`Zakres dat: ${firstDate} – ${lastDate}`), 14, 40);
        doc.text(fixPL(`Uzytkownicy: ${uniqueUsers}`), 14, 47);
        doc.text(fixPL(`Wszystkich planow: ${totalPlans}`), 14, 54);
        doc.text(fixPL(`• Recznych: ${manualPlans}`), 14, 61);
        doc.text(fixPL(`• Automatycznych: ${autoPlans}`), 14, 68);
        doc.text(
            fixPL(`Srednia liczba planow na uzytkownika: ${avgPlansPerUser}`),
            14,
            75
        );
        doc.text(
            fixPL(
                `Najczesciej wybierana pora dnia: ${
                    mostCommonTime === "MORNING"
                        ? "Poranna"
                        : mostCommonTime === "EVENING"
                            ? "Wieczorna"
                            : "Dowolna"
                }`
            ),
            14,
            82
        );

        // 🔹 Tabela szczegółowa
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(fixPL("Szczegoly planow:"), 14, 95);

        const tableData = plans.map((p) => [
            fixPL(p.user?.username || "—"),
            fixPL(p.name || "—"),
            fixPL(p.source === "AUTO" ? "Automatyczny" : "Reczny"),
            fixPL(
                p.routineTime === "MORNING"
                    ? "Poranna"
                    : p.routineTime === "EVENING"
                        ? "Wieczorna"
                        : "Dowolna"
            ),
            new Date(p.createdAt).toLocaleDateString(),
            new Date(p.updatedAt).toLocaleDateString(),
        ]);

        autoTable(doc, {
            startY: 100,
            head: [
                [
                    fixPL("Uzytkownik"),
                    fixPL("Nazwa planu"),
                    fixPL("Typ"),
                    fixPL("Pora dnia"),
                    fixPL("Utworzono"),
                    fixPL("Aktualizacja"),
                ],
            ],
            body: tableData,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: {
                fillColor: [246, 231, 220],
                textColor: [75, 50, 30],
            },
        });

        // Zapis PDF
        doc.save(`Raport_Pielegnacyjny_${formattedDate}_${formattedTime}.pdf`);
    };

    const filteredPlans = [...plans]
        .filter((p) => (typeFilter ? p.source === typeFilter : true))
        .filter((p) => (timeFilter ? p.routineTime === timeFilter : true))
        .sort((a, b) => {
            const [key, direction] = sortBy.split("_");
            const diff = new Date(a[key]) - new Date(b[key]);
            return direction === "asc" ? diff : -diff;
        });



    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await skincarePlanService.getAllPlans();
                console.log("Dane planów:", data);

                if (Array.isArray(data)) {
                    setPlans(data);
                } else {
                    console.warn("Backend nie zwrócił tablicy!");
                    setPlans([]);
                }
            } catch (err) {
                console.error("Błąd podczas pobierania planów:", err);
                alert("Nie udało się pobrać planów pielęgnacyjnych.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);


    if (loading) return <p style={{ textAlign: "center" }}>Ładowanie planów...</p>;

    return (
        <div className="admin-page">
            <Navbar />
            <div className="admin-content">
                <h1>Wszystkie plany pielęgnacyjne użytkowników</h1>

                {/* 🔹 Filtry */}
                <div className="filters-row">
                    <div>
                        <label>Typ planu:</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="">Wszystkie</option>
                            <option value="AUTO">Automatyczny</option>
                            <option value="MANUAL">Ręczny</option>
                        </select>
                    </div>

                    <div>
                        <label>Pora dnia:</label>
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                        >
                            <option value="">Wszystkie</option>
                            <option value="MORNING">Poranna</option>
                            <option value="EVENING">Wieczorna</option>
                            <option value="ANY">Dowolna</option>
                        </select>
                    </div>

                    <div>
                        <label>Sortuj według:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="createdAt_desc">Utworzono (najnowsze)</option>
                            <option value="createdAt_asc">Utworzono (najstarsze)</option>
                            <option value="updatedAt_desc">Ostatnia aktualizacja (najnowsze)</option>
                            <option value="updatedAt_asc">Ostatnia aktualizacja (najstarsze)</option>
                        </select>

                    </div>
                </div>

                <button className="report-btn" onClick={generateReport}>
                     Pobierz raport PDF
                </button>

                {/* 🔹 Tabela */}
                {filteredPlans.length === 0 ? (
                    <p>Brak planów w systemie.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Użytkownik</th>
                            <th>Nazwa planu</th>
                            <th>Typ</th>
                            <th>Pora dnia</th>
                            <th>Utworzono</th>
                            <th>Ostatnia aktualizacja</th>
                            <th className="action-col">Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPlans.map((p) => (
                            <tr key={p.id}>
                                <td>{p.user?.username || "—"}</td>
                                <td>{p.name || "—"}</td>
                                <td>{p.source === "AUTO" ? "Automatyczny" : "Ręczny"}</td>
                                <td>
                                    {p.routineTime === "MORNING"
                                        ? "Poranna"
                                        : p.routineTime === "EVENING"
                                            ? "Wieczorna"
                                            : "Dowolna"}
                                </td>
                                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="details-btn"
                                        onClick={() => navigate(`/admin/plans/${p.id}`)}
                                    >
                                        Szczegóły
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

};

export default ManagePlans;
