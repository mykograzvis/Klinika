const API_URL = "https://localhost:7237/api"; // Pakeisk pagal savo porto numerį

export const login = async (elPastas, slaptazodis) => {
    const response = await fetch(`${API_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elPastas, slaptazodis })
    });

    if (!response.ok) throw new Error("Prisijungti nepavyko");

    const token = await response.text();
    localStorage.setItem("token", token); // Išsaugo žetoną naršyklėje
    return token;
};

export const getPacientai = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/Pacientai`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
};