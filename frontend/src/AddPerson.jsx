import React, { useState } from "react";

function AddPerson() {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/addPerson", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, age: parseInt(age) }),
            });

            if (response.ok) {
                setMessage("✅ Osoba została dodana!");
                setName("");
                setAge("");
            } else {
                const errText = await response.text();
                setMessage("❌ Błąd: " + errText);
            }
        } catch (error) {
            console.error("Błąd:", error);
            setMessage("⚠️ Nie udało się połączyć z backendem.");
        }
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "40px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            <h2>Dodaj osobę</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Imię:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Wiek:</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px" }}>
                    Dodaj
                </button>
            </form>
            {message && <p style={{ marginTop: "10px" }}>{message}</p>}
        </div>
    );
}

export default AddPerson;
