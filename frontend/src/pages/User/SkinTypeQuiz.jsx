import React, { useState } from "react";
import "./SkinTypeQuiz.css";
import Navbar from "../../components/Navbar/UserNavbar";


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

        // --- logika diagnozy skóry ---
        if (answers.afterWash === "tight" || answers.reaction === "cracks") {
            detected.push("Cera sucha");
        }
        if (answers.afterWash === "oily" || answers.pores === "visibleAll") {
            detected.push("Cera tłusta");
        }
        if (answers.afterWash === "tZone" || answers.pores === "visibleT") {
            detected.push("Cera mieszana");
        }
        if (answers.sensitive === "yes" || answers.reaction === "red") {
            detected.push("Cera wrażliwa");
        }
        if (answers.redness === "yes") {
            detected.push("Cera naczynkowa");
        }
        if (answers.pigmentation === "yes") {
            detected.push("Cera z przebarwieniami");
        }
        if (answers.acneProne === "yes" || answers.acne === "often") {
            detected.push("Cera trądzikowa");
        }

        const uniqueResults = [...new Set(detected)];
        setResults(uniqueResults.length ? uniqueResults : ["Nieokreślona"]);
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
        setShowResults(false);
        setResults([]);
    };

    return (
        <div className="quiz-container">
            <Navbar role="user" />
            <div className="quiz-content">
                <h1>Poznaj swój typ skóry</h1>
                <p>Wypełnij ankietę i dowiedz się, jakie typy cery dominują u Ciebie.</p>

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

                        {/* 2️⃣ Reakcja */}
                        <div className="form-group">
                            <p>Jak wygląda Twoja cera po spacerze na chłodzie lub słońcu?</p>
                            {[
                                { label: "jest gładka i świeża", value: "smooth" },
                                { label: "na policzkach piecze i jest zaczerwieniona", value: "red" },
                                { label: "zaczerwieniona, piecze i pęka", value: "cracks" },
                                { label: "bez zmian", value: "none" },
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
                            <p>Jak często na Twojej cerze pojawiają się wypryski?</p>
                            {[
                                { label: "prawie nigdy", value: "rarely" },
                                { label: "rzadko", value: "sometimes" },
                                { label: "często", value: "often" },
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
                                { label: "małe i średnie", value: "small" },
                                { label: "widoczne w strefie T (czoło, nos, broda)", value: "visibleT" },
                                { label: "widoczne na całej twarzy", value: "visibleAll" },
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

                        {/* 5️⃣ Po umyciu */}
                        <div className="form-group">
                            <p>Po 30 minutach od umycia Twoja cera jest:</p>
                            {[
                                { label: "gładka i miękka", value: "smooth" },
                                { label: "napięta i sucha", value: "tight" },
                                { label: "sucha na policzkach, tłusta w strefie T", value: "tZone" },
                                { label: "tłusta i błyszcząca", value: "oily" },
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
                            <p>Czy łatwo się czerwienisz?</p>
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

                        {/* 8️⃣ Wrażliwa */}
                        <div className="form-group">
                            <p>Czy masz cerę wrażliwą?</p>
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
                            <p>Czy masz trądzik?</p>
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
                        <p>{results.join(", ")}</p>

                        <div className="results-details">
                            {results.includes("Cera mieszana") && (
                                <div>
                                    <h3>Cera mieszana</h3>
                                    <p>Skóra tłusta w strefie T, sucha na policzkach. Wymaga różnej pielęgnacji.</p>
                                </div>
                            )}
                            {results.includes("Cera sucha") && (
                                <div>
                                    <h3>Cera sucha</h3>
                                    <p>Skóra napięta i matowa. Wymaga silnego nawilżania i ochrony lipidowej.</p>
                                </div>
                            )}
                            {results.includes("Cera tłusta") && (
                                <div>
                                    <h3>Cera tłusta</h3>
                                    <p>Błyszcząca, z rozszerzonymi porami. Wymaga delikatnego oczyszczania.</p>
                                </div>
                            )}
                            {results.includes("Cera wrażliwa") && (
                                <div>
                                    <h3>Cera wrażliwa</h3>
                                    <p>Łatwo reaguje podrażnieniem. Unikaj alkoholu i mocnych kwasów.</p>
                                </div>
                            )}
                            {results.includes("Cera naczynkowa") && (
                                <div>
                                    <h3>Cera naczynkowa</h3>
                                    <p>Cienka, skłonna do rumienia. Wymaga ochrony przed zimnem i UV.</p>
                                </div>
                            )}
                            {results.includes("Cera z przebarwieniami") && (
                                <div>
                                    <h3>Cera z przebarwieniami</h3>
                                    <p>Nierówny koloryt skóry. Pomocne są kosmetyki z witaminą C i filtrami.</p>
                                </div>
                            )}
                            {results.includes("Cera trądzikowa") && (
                                <div>
                                    <h3>Cera trądzikowa</h3>
                                    <p>Wypryski i nadmiar sebum. Wymaga lekkiej, antybakteryjnej pielęgnacji.</p>
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
