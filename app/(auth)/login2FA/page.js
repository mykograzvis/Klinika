export default function Login2FA({ userId, onLoginSuccess }) {
    const [pin, setPin] = useState("");

    const handleSubmit = async () => {
        const res = await fetch("https://localhost:7237/api/Auth/verify-2fa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, pin })
        });

        if (res.ok) {
            const data = await res.json();
            // Išsaugome JWT tokeną ir einame į vidų
            localStorage.setItem("token", data.token);
            onLoginSuccess();
        } else {
            alert("Neteisingas kodas!");
        }
    };

    return (
        <div>
            <h2>Dviejų veiksnių autentifikacija</h2>
            <p>Įveskite kodą iš savo programėlės</p>
            <input value={pin} onChange={(e) => setPin(e.target.value)} />
            <button onClick={handleSubmit}>Prisijungti</button>
        </div>
    );
}