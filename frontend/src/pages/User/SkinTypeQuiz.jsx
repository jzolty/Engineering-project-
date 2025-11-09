import React, { useState } from "react";
import "./SkinTypeQuiz.css";
import Navbar from "../../components/Navbar/UserNavbar";

/**
 * Źródło merytoryczne:
 * Baumann, L. (2006). The Skin Type Solution. Bantam Dell Publishing Group.
 * Logika quizu inspirowana klasyfikacją dermatologiczną Baumann,
 * uproszczona do sześciu typów skóry: NORMAL, DRY, OILY, COMBINATION, SENSITIVE, MATURE_SKIN.
 */

const SkinTypeQuiz = () => {
    const [answers, setAnswers] = useState({
        age: "",
        reaction: "",
        acne: "",
        pores: "",
        afterWash: "",
        redness: "",
        pigmentation: "",
        sensitive: "",
        acneProne: "",
    });

    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnswers({ ...answers, [name]: value });
    };

    const calculateResults = () => {
        let detected = [];

        // === Logika diagnozy zgodna z Baumann (2006) ===
        // Osie: Oily vs Dry, Sensitive vs Resistant, Pigmented, Wrinkled
        // uproszczone do najbardziej rozpoznawalnych typów skóry.

        if (answers.afterWash === "tight" || answers.reaction === "cracks") {
            detected.push("DRY");
        }
        if (answers.afterWash === "oily" || answers.pores === "visibleAll") {
            detected.push("OILY");
        }
        if (answers.afterWash === "tZone" || answers.pores === "visibleT") {
            detected.push("COMBINATION");
        }
        if (answers.sensitive === "yes" || answers.reaction === "red") {
            detected.push("SENSITIVE");
        }
        if (answers.age === "over50") {
            detected.push("MATURE_SKIN");
        }

        // Jeżeli nic nie wykryto → cera normalna
        if (detected.length === 0) {
            detected.push("NORMAL");
        }

        // Usuwanie duplikatów i ograniczenie do max 3 typów
        const uniqueResults = [...new Set(detected)].slice(0, 3);
        setResults(uniqueResults);
        setShowResults(true);
    };

    const handleReset = () => {
        setAnswers({
            age: "",
            reaction: "",
            acne: "",
            pores: "",
            afterWash: "",
            redness: "",
            pigmentation: "",
            sensitive: "",
            acneProne: "",
        });
        setResults([]);
        setShowResults(false);
    };

    const readableNames = {
        NORMAL: "Cera normalna",
        DRY: "Cera sucha",
        OILY: "Cera tłusta",
        COMBINATION: "Cera mieszana",
        SENSITIVE: "Cera wrażliwa",
        MATURE_SKIN: "Cera dojrzała",
    };

    return (
        <div className="quiz-container">
            <Navbar role="user" />
            <div className="quiz-content">
                <h1>Poznaj swój typ skóry</h1>
                <p>Wypełnij ankietę opracowaną na podstawie klasyfikacji Baumann (2006) i dowiedz się, jaki typ cery dominuje u Ciebie.</p>

                {!showResults ? (
                    <form className="quiz-form">
                        {/* 1️⃣ Wiek */}
                        <div className="form-group">
                            <p>W jakim jesteś wieku?</p>
                            {[
                                { label: "do 30 lat", value: "under30" },
                                { label: "30–40 lat", value: "30-40" },
                                { label: "40–50 lat", value: "40-50" },
                                { label: "powyżej 50 lat", value: "over50" },
                            ].map((opt) => (
                                <label key={opt.value}>
                                    <input
                                        type="radio"
                                        name="age"
                                        value={opt.value}
                                        checked={answers.age === opt.value}
                                        onChange={handleChange}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* 2️⃣ Reakcja skóry na czynniki zewnętrzne */}
                        <div className="form-group">
                            <p>Jak reaguje Twoja skóra na chłód lub słońce?</p>
                            {[
                                { label: "Jest gładka i świeża", value: "smooth" },
                                { label: "Na policzkach piecze i jest zaczerwieniona", value: "red" },
                                { label: "Zaczerwieniona, piecze i pęka", value: "cracks" },
                                { label: "Bez zmian", value: "none" },
                            ].map((opt) => (
                                <label key={opt.value}>
                                    <input
                                        type="radio"
                                        name="reaction"
                                        value={opt.value}
                                        checked={answers.reaction === opt.value}
                                        onChange={handleChange}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* 3️⃣ Wypryski */}
                        <div className="form-group">
                            <p>Jak często pojawiają się wypryski?</p>
                            {[
                                { label: "Prawie nigdy", value: "rarely" },
                                { label: "Rzadko", value: "sometimes" },
                                { label: "Często", value: "often" },
                            ].map((opt) => (
                                <label key={opt.value}>
                                    <input
                                        type="radio"
                                        name="acne"
                                        value={opt.value}
                                        checked={answers.acne === opt.value}
                                        onChange={handleChange}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* 4️⃣ Pory */}
                        <div className="form-group">
                            <p>Jak wyglądają Twoje pory?</p>
                            {[
                                { label: "Małe i średnie", value: "small" },
                                { label: "Widoczne w strefie T (czoło, nos, broda)", value: "visibleT" },
                                { label: "Widoczne na całej twarzy", value: "visibleAll" },
                            ].map((opt) => (
                                <label key={opt.value}>
                                    <input
                                        type="radio"
                                        name="pores"
                                        value={opt.value}
                                        checked={answers.pores === opt.value}
                                        onChange={handleChange}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* 5️⃣ Odczucie po umyciu twarzy */}
                        <div className="form-group">
                            <p>Po 30 minutach od umycia twarzy Twoja skóra jest:</p>
                            {[
                                { label: "Gładka i miękka", value: "smooth" },
                                { label: "Napięta i sucha", value: "tight" },
                                { label: "Sucha na policzkach, tłusta w strefie T", value: "tZone" },
                                { label: "Tłusta i błyszcząca", value: "oily" },
                            ].map((opt) => (
                                <label key={opt.value}>
                                    <input
                                        type="radio"
                                        name="afterWash"
                                        value={opt.value}
                                        checked={answers.afterWash === opt.value}
                                        onChange={handleChange}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>

                        {/* 6️⃣ Czerwienienie */}
                        <div className="form-group">
                            <p>Czy Twoja skóra łatwo się czerwieni?</p>
                            {["yes", "no"].map((v) => (
                                <label key={v}>
                                    <input
                                        type="radio"
                                        name="redness"
                                        value={v}
                                        checked={answers.redness === v}
                                        onChange={handleChange}
                                    />
                                    {v === "yes" ? "tak" : "nie"}
                                </label>
                            ))}
                        </div>

                        {/* 7️⃣ Przebarwienia */}
                        <div className="form-group">
                            <p>Czy masz problem z przebarwieniami?</p>
                            {["yes", "no"].map((v) => (
                                <label key={v}>
                                    <input
                                        type="radio"
                                        name="pigmentation"
                                        value={v}
                                        checked={answers.pigmentation === v}
                                        onChange={handleChange}
                                    />
                                    {v === "yes" ? "tak" : "nie"}
                                </label>
                            ))}
                        </div>

                        {/* 8️⃣ Wrażliwość */}
                        <div className="form-group">
                            <p>Czy Twoja skóra jest wrażliwa?</p>
                            {["yes", "no"].map((v) => (
                                <label key={v}>
                                    <input
                                        type="radio"
                                        name="sensitive"
                                        value={v}
                                        checked={answers.sensitive === v}
                                        onChange={handleChange}
                                    />
                                    {v === "yes" ? "tak" : "nie"}
                                </label>
                            ))}
                        </div>

                        {/* 9️⃣ Trądzik */}
                        <div className="form-group">
                            <p>Czy masz tendencję do trądziku?</p>
                            {["yes", "no"].map((v) => (
                                <label key={v}>
                                    <input
                                        type="radio"
                                        name="acneProne"
                                        value={v}
                                        checked={answers.acneProne === v}
                                        onChange={handleChange}
                                    />
                                    {v === "yes" ? "tak" : "nie"}
                                </label>
                            ))}
                        </div>

                        <button type="button" className="submit-btn" onClick={calculateResults}>
                            Sprawdź
                        </button>
                    </form>
                ) : (
                    <div className="results-section">
                        <h2>Wynik analizy</h2>
                        <p>{results.map((r) => readableNames[r]).join(", ")}</p>

                        <div className="results-details">
                            {results.includes("COMBINATION") && (
                                <div>
                                    <h3>Cera mieszana</h3>
                                    <p>Skóra tłusta w strefie T, sucha na policzkach. Wymaga różnej pielęgnacji w zależności od partii twarzy.</p>
                                </div>
                            )}
                            {results.includes("DRY") && (
                                <div>
                                    <h3>Cera sucha</h3>
                                    <p>Napięta, szorstka i matowa. Wymaga intensywnego nawilżania i ochrony bariery lipidowej.</p>
                                </div>
                            )}
                            {results.includes("OILY") && (
                                <div>
                                    <h3>Cera tłusta</h3>
                                    <p>Skłonna do błyszczenia i powstawania niedoskonałości. Wymaga regularnego, delikatnego oczyszczania.</p>
                                </div>
                            )}
                            {results.includes("SENSITIVE") && (
                                <div>
                                    <h3>Cera wrażliwa</h3>
                                    <p>Łatwo reaguje podrażnieniem i zaczerwienieniem. Wskazana pielęgnacja z minimalną ilością substancji zapachowych.</p>
                                </div>
                            )}
                            {results.includes("MATURE_SKIN") && (
                                <div>
                                    <h3>Cera dojrzała</h3>
                                    <p>Zmniejszona elastyczność, obecność zmarszczek i suchość. Wymaga pielęgnacji przeciwstarzeniowej i ochrony UV.</p>
                                </div>
                            )}
                            {results.includes("NORMAL") && (
                                <div>
                                    <h3>Cera normalna</h3>
                                    <p>Równowaga między wydzielaniem sebum a nawilżeniem. Wystarczy pielęgnacja podtrzymująca naturalny balans.</p>
                                </div>
                            )}
                        </div>

                        <button className="reset-btn" onClick={handleReset}>
                            Wypełnij ponownie
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkinTypeQuiz;
