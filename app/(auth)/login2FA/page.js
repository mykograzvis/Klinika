"use client"; // Būtina Next.js App Routeryje
import API_URL from '@/services/api';
import { useState } from "react"; // Importuojame hook'ą

export default function Login2FA({ userId, onLoginSuccess }) {
    const [pin, setPin] = useState("");

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${API_URL}/api/Auth/verify-2fa`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, pin })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                // Jei turi userId, išsisaugok ir jį, kad rezervacija veiktų:
                // localStorage.setItem("userId", userId); 
                onLoginSuccess();
            } else {
                alert("Neteisingas kodas!");
            }
        } catch (err) {
            console.error("Klaida:", err);
            alert("Nepavyko susisiekti su serveriu.");
        }
    };

    return (
        <div className="p-4 border rounded shadow-sm bg-white">
            <h2 className="h4 fw-bold">Dviejų veiksnių autentifikacija</h2>
            <p className="text-muted small">Įveskite kodą iš savo programėlės</p>
            <input 
                className="form-control mb-3"
                value={pin} 
                onChange={(e) => setPin(e.target.value)} 
                placeholder="000000"
            />
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Prisijungti
            </button>
        </div>
    );
}