"use client";
import { useEffect, useState } from "react";
import BazinisGrafikas from "./BazinisGrafikas";
import GrafikoIsimtys from "./GrafikoIsimtys";
import styles from "./grafikas.module.css";
import API_URL from '@/services/api';
import { useToast } from "@/context/ToastContext";

const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
};

function ConfirmModal({ isOpen, title, message, confirmLabel = "Patvirtinti", danger = false, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998 }}
      onClick={onCancel}
    >
      <div
        style={{ background: "#fff", borderRadius: 16, padding: "2rem", maxWidth: 360, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 style={{ marginBottom: "0.5rem", fontWeight: 700, fontSize: "1.1rem" }}>{title}</h5>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "0.625rem 1rem", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
            Atšaukti
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "0.625rem 1rem", borderRadius: 8, border: "none", background: danger ? "#ef4444" : "#2563eb", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GrafikoValdymas() {
  const { success, error, warning, info } = useToast();
  const [grafikas, setGrafikas] = useState([]);
  const [isimtys, setIsimtys] = useState([]);
  const [gydytojai, setGydytojai] = useState([]);
  const [pasirinktasGydytojasId, setPasirinktasGydytojasId] = useState("");
  const [naujaIsimtis, setNaujaIsimtis] = useState({ data: "", priezastis: "", arDirba: false });
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
      const res = await fetch(`${API_URL}/api/Gydytojai`, {
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
        fetch(`${API_URL}/api/Grafikas/mano${query}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/Grafikas/isimtys${query}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (gRes.ok) setGrafikas(await gRes.json());
      if (iRes.ok) setIsimtys(await iRes.json());
    } finally { setLoading(false); }
  };

  const handleIssaugotiBaze = async () => {
    setSaving(true);
    const query = pasirinktasGydytojasId ? `?gydytojoId=${pasirinktasGydytojasId}` : "";
    const res = await fetch(`${API_URL}/api/Grafikas/atnaujinti${query}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(grafikas),
    });
    if (res.ok) success("Grafikas išsaugotas", "Darbo grafikas sėkmingai atnaujintas.");
    setSaving(false);
  };

  const handlePridetiIsimti = async () => {
    if (!naujaIsimtis.data) return warning("Pasirinkite datą", "Įveskite išimties datą.");
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    const manoId = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] || decoded["sub"];

    const gydytojoId = userRole === "Adminas"
      ? String(pasirinktasGydytojasId)
      : String(localStorage.getItem("userId") || "");

    if (!gydytojoId) return error("Klaida", "Nepavyko nustatyti gydytojo ID.");

    const body = {
      gydytojoId,
      data: new Date(naujaIsimtis.data).toISOString(),
      priezastis: naujaIsimtis.priezastis || "Laisvadienis",
      arDirba: false,
    };

    try {
      const res = await fetch(`${API_URL}/api/Grafikas/isimtis`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      const responseText = await res.text();
      if (res.ok) {
        const data = JSON.parse(responseText);
        setNaujaIsimtis({ data: "", priezastis: "", arDirba: false });
        fetchDuomenys();
        if (data.atsauktuKiekis > 0)
          info("Išimtis pridėta", `Atšaukta vizitų: ${data.atsauktuKiekis}`);
        else
          success("Išimtis pridėta", "Data sėkmingai pažymėta kaip laisvadienis.");
      } else {
        error("Klaida", `${res.status}: ${responseText}`);
      }
    } catch (err) {
      error("Ryšio klaida", err.message);
    }
  };

  const handleTrintiIsimti = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    const res = await fetch(`${API_URL}/api/Grafikas/isimtis/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) fetchDuomenys();
    else error("Klaida", "Nepavyko ištrinti išimties.");
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

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        title="Ištrinti išimtį?"
        message="Ši data bus pašalinta iš išimčių sąrašo."
        confirmLabel="Ištrinti"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
