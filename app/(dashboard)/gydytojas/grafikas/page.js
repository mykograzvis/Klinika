"use client";
import { useEffect, useState } from "react";
import BazinisGrafikas from "./BazinisGrafikas";
import GrafikoIsimtys from "./GrafikoIsimtys";
import styles from "./grafikas.module.css";

const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
};

export default function GrafikoValdymas() {
  const [grafikas, setGrafikas] = useState([]);
  const [isimtys, setIsimtys] = useState([]);
  const [gydytojai, setGydytojai] = useState([]);
  const [pasirinktasGydytojasId, setPasirinktasGydytojasId] = useState("");
  const [naujaIsimtis, setNaujaIsimtis] = useState({ data: "", priezastis: "", arDirba: false });
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        const role = decoded["role"] || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setUserRole(role);
        if (role === "Adminas") fetchGydytojai();
        else fetchDuomenys();
      }
    }
  }, []);

  useEffect(() => {
    if (pasirinktasGydytojasId || (userRole && userRole !== "Adminas")) fetchDuomenys();
  }, [pasirinktasGydytojasId, userRole]);

  const fetchGydytojai = async () => {
    try {
      const res = await fetch("https://localhost:7237/api/Gydytojai", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGydytojai(data);
        if (data.length > 0) setPasirinktasGydytojasId(data[0].id);
      }
    } catch (err) { console.error(err); }
  };

  const fetchDuomenys = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const query = pasirinktasGydytojasId ? `?gydytojoId=${pasirinktasGydytojasId}` : "";
    try {
      const [gRes, iRes] = await Promise.all([
        fetch(`https://localhost:7237/api/Grafikas/mano${query}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`https://localhost:7237/api/Grafikas/isimtys${query}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (gRes.ok) setGrafikas(await gRes.json());
      if (iRes.ok) setIsimtys(await iRes.json());
    } finally { setLoading(false); }
  };

  const handleIssaugotiBaze = async () => {
    setSaving(true);
    const query = pasirinktasGydytojasId ? `?gydytojoId=${pasirinktasGydytojasId}` : "";
    const res = await fetch(`https://localhost:7237/api/Grafikas/atnaujinti${query}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(grafikas),
    });
    if (res.ok) alert("Grafikas išsaugotas.");
    setSaving(false);
  };

  const handlePridetiIsimti = async () => {
    if (!naujaIsimtis.data) return alert("Pasirinkite datą");
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const manoId = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] || decoded["sub"];

    const gydytojoId = userRole === "Adminas"
      ? String(pasirinktasGydytojasId)
      : String(manoId || "");

    if (!gydytojoId) return alert("Nepavyko nustatyti gydytojo ID.");

    const body = {
      gydytojoId,
      data: new Date(naujaIsimtis.data).toISOString(),
      priezastis: naujaIsimtis.priezastis || "Laisvadienis",
      arDirba: false,
    };

    try {
      const res = await fetch("https://localhost:7237/api/Grafikas/isimtis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const responseText = await res.text();

      if (res.ok) {
        const data = JSON.parse(responseText);
        setNaujaIsimtis({ data: "", priezastis: "", arDirba: false });
        fetchDuomenys();
        if (data.atsauktuKiekis > 0)
          alert(`Išimtis pridėta. Atšaukta vizitų: ${data.atsauktuKiekis}`);
      } else {
        alert(`Klaida ${res.status}: ${responseText}`);
      }
    } catch (err) {
      alert(`Ryšio klaida: ${err.message}`);
    }
  };

  const handleTrintiIsimti = async (id) => {
    if (!confirm("Ištrinti šią išimtį?")) return;
    const res = await fetch(`https://localhost:7237/api/Grafikas/isimtis/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) fetchDuomenys();
    else alert("Nepavyko ištrinti.");
  };

  const updateDiena = (index, laukas, verte) => {
    const naujas = [...grafikas];
    naujas[index][laukas] = verte;
    if (laukas === "dirba" && verte && !naujas[index].pradzia) {
      naujas[index].pradzia = "08:00";
      naujas[index].pabaiga = "17:00";
    }
    setGrafikas(naujas);
  };

  if (loading && !grafikas.length)
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner} />
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Darbo grafikas</h1>
        {userRole === "Adminas" && (
          <select
            className={styles.doctorSelect}
            value={pasirinktasGydytojasId}
            onChange={e => setPasirinktasGydytojasId(e.target.value)}
          >
            {gydytojai.map(g => (
              <option key={g.id} value={g.id}>{g.vardas} {g.pavarde}</option>
            ))}
          </select>
        )}
      </div>

      <BazinisGrafikas
        grafikas={grafikas}
        updateDiena={updateDiena}
        onSave={handleIssaugotiBaze}
        saving={saving}
      />

      <GrafikoIsimtys
        isimtys={isimtys}
        naujaIsimtis={naujaIsimtis}
        setNaujaIsimtis={setNaujaIsimtis}
        onAdd={handlePridetiIsimti}
        onDelete={handleTrintiIsimti}
      />
    </div>
  );
}
