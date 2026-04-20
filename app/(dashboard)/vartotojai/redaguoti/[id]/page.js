"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API_URL from '@/services/api';
import { useToast } from "@/context/ToastContext";

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

export default function AdminRedaguotiVartotoja() {
  const { id } = useParams();
  const router = useRouter();
  const { success, error, warning, info } = useToast();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessData, setAccessData] = useState({ naujasEmail: "", naujasSlaptazodis: "" });

  const [confirmType, setConfirmType] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "Adminas") {
      error("Prieiga uždrausta", "Tik administratoriai gali redaguoti vartotojus.");
      router.push("/dashboard");
      return;
    }
    setIsAuthorized(true);
    fetchUser(token);
  }, [id, router]);

  const fetchUser = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUserData(await res.json());
      } else {
        error("Vartotojas nerastas", "Vartotojas nerastas arba įvyko klaida.");
        router.push("/vartotojai");
      }
    } catch (err) {
      console.error("Klaida siunčiant užklausą:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Vartotojai/admin-atnaujinti/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(userData),
    });
    if (res.ok) { success("Išsaugota!", "Duomenys sėkmingai atnaujinti."); router.push("/vartotojai"); }
    else error("Klaida", "Nepavyko atnaujinti bendrų duomenų.");
  };

  const handleUpdateAccessClick = (e) => {
    e.preventDefault();
    if (!accessData.naujasEmail && !accessData.naujasSlaptazodis) {
      warning("Nepilna forma", "Užpildykite bent vieną lauką: naują el. paštą arba slaptažodį.");
      return;
    }
    setConfirmType("access");
  };

  const handleConfirmUpdateAccess = async () => {
    setConfirmType(null);
    const token = localStorage.getItem("token");
    const payload = {
      naujasEmail: accessData.naujasEmail.trim() || null,
      naujasSlaptazodis: accessData.naujasSlaptazodis || null,
    };
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/admin-atnaujinti-prieiga/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        success("Atnaujinta!", result.message || "Prieigos duomenys pakeisti sėkmingai.");
        setAccessData({ naujasEmail: "", naujasSlaptazodis: "" });
        fetchUser(token);
      } else {
        error("Klaida", result || "Nepavyko pakeisti duomenų. Patikrinkite, ar el. paštas neužimtas.");
      }
    } catch (err) {
      console.error("Klaida keičiant prieigą:", err);
      error("Ryšio klaida", "Nepavyko susisiekti su serveriu.");
    }
  };

  const handleConfirmReset2FA = async () => {
    setConfirmType(null);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/admin-reset-2fa/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { success("2FA išjungtas", "Dviejų veiksnių autentifikacija sėkmingai išjungta."); fetchUser(token); }
      else error("Klaida", "Nepavyko nuresetinti 2FA.");
    } catch (err) { console.error(err); }
  };

  const handleConfirmDelete = async () => {
    setConfirmType(null);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/Vartotojai/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) { info("Vartotojas pašalintas", "Paskyra sėkmingai ištrinta."); router.push("/vartotojai"); }
    else { const msg = await res.text(); error("Klaida", msg || "Klaida trinant vartotoją."); }
  };

  const handleConfirm = () => {
    if (confirmType === "access")  handleConfirmUpdateAccess();
    if (confirmType === "reset2fa") handleConfirmReset2FA();
    if (confirmType === "delete")  handleConfirmDelete();
  };

  const modalConfig = {
    access:   { title: "Pakeisti prisijungimo duomenis?", message: "Vartotojas turės naudoti naujus duomenis prisijungdamas.",           confirmLabel: "Pakeisti",  danger: false },
    reset2fa: { title: "Išjungti 2FA?",                  message: "Vartotojo dviejų veiksnių apsauga bus išjungta.",                     confirmLabel: "Išjungti",  danger: true  },
    delete:   { title: "Ištrinti paskyrą?",              message: "Šio veiksmo negalima atšaukti. Vartotojas bus ištrintas visam laikui.", confirmLabel: "Ištrinti",  danger: true  },
  };

  if (loading || !isAuthorized) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Kraunama...</span>
        </div>
      </div>
    );
  }

  const cfg = modalConfig[confirmType] || {};

  return (
    <div className="container py-4" style={{ maxWidth: "800px", fontFamily: "sans-serif" }}>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button onClick={() => router.push("/vartotojai")} className="btn btn-link p-0 m-0 align-baseline" style={{ textDecoration: "none" }}>
              Vartotojai
            </button>
          </li>
          <li className="breadcrumb-item active">Redagavimas</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Redaguoti profilį</h3>
          <p className="text-muted small">{userData.elPastas} ({userData.role})</p>
        </div>
        <button onClick={() => setConfirmType("delete")} className="btn btn-outline-danger shadow-sm px-4">
          Ištrinti paskyrą
        </button>
      </div>

      <div className="card p-4 shadow-sm border-0 bg-white mb-4">
        <form onSubmit={handleUpdate}>
          <h5 className="mb-4 fw-bold">Asmeninė informacija</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small text-muted">Vardas</label>
              <input className="form-control" value={userData.vardas || ""} onChange={(e) => setUserData({ ...userData, vardas: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Pavardė</label>
              <input className="form-control" value={userData.pavarde || ""} onChange={(e) => setUserData({ ...userData, pavarde: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small text-muted">Telefonas</label>
              <input className="form-control" value={userData.telefonas || ""} onChange={(e) => setUserData({ ...userData, telefonas: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Amžius</label>
              <input type="number" className="form-control" value={userData.amzius || 0} onChange={(e) => setUserData({ ...userData, amzius: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="col-md-3">
              <label className="form-label small text-muted">Kraujo grupė</label>
              <input className="form-control" value={userData.kraujoGrupe || ""} onChange={(e) => setUserData({ ...userData, kraujoGrupe: e.target.value })} />
            </div>
            {userData.role === "Gydytojas" && (
              <>
                <div className="col-12 mt-4"><h5 className="fw-bold">Gydytojo informacija</h5><hr /></div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Specializacija</label>
                  <input className="form-control" value={userData.specializacija || ""} onChange={(e) => setUserData({ ...userData, specializacija: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">Patirtis (metais)</label>
                  <input type="number" className="form-control" value={userData.darboPatirtisMetais || 0} onChange={(e) => setUserData({ ...userData, darboPatirtisMetais: parseInt(e.target.value) || 0 })} />
                </div>
              </>
            )}
          </div>
          <div className="mt-4">
            <button type="submit" className="btn btn-primary px-5 rounded-pill fw-bold shadow-sm">
              Išsaugoti bendrus pakeitimus
            </button>
          </div>
        </form>
      </div>

      <div className="card p-4 shadow-sm border-0 bg-white mb-4 border-top border-warning border-4">
        <h5 className="fw-bold text-dark">⚠️ Paskyros prieigos valdymas</h5>
        <p className="small text-muted mb-4">Naudokite šią sekciją el. pašto keitimui arba priverstiniam slaptažodžio nustatymui.</p>
        <form onSubmit={handleUpdateAccessClick}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Naujas el. paštas</label>
              <input type="email" className="form-control" placeholder="palikite tuščią, jei nekeičiate" value={accessData.naujasEmail} onChange={(e) => setAccessData({ ...accessData, naujasEmail: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Naujas slaptažodis</label>
              <input type="text" className="form-control" placeholder="įrašykite naują slaptažodį" value={accessData.naujasSlaptazodis} onChange={(e) => setAccessData({ ...accessData, naujasSlaptazodis: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-warning mt-4 fw-bold shadow-sm px-4">Atnaujinti prieigos duomenis</button>
        </form>
      </div>

      <div className="card p-4 shadow-sm border-0 bg-white border-top border-info border-4">
        <h5 className="fw-bold text-info">🔐 Dviejų veiksnių autentifikacija (2FA)</h5>
        <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded mt-3">
          <div>
            <span className="text-muted small d-block">Dabartinis statusas:</span>
            {userData.isTwoFactorEnabled ? <strong className="text-success">✅ Aktyvuota</strong> : <strong className="text-secondary">❌ Neaktyvuota</strong>}
          </div>
          {userData.isTwoFactorEnabled && (
            <button type="button" onClick={() => setConfirmType("reset2fa")} className="btn btn-outline-info fw-bold shadow-sm px-3">
              Išjungti vartotojo 2FA
            </button>
          )}
        </div>
        <p className="small text-muted mt-2 mb-0">Išjungus 2FA, vartotojas kitą kartą prisijungęs galės vėl nustatyti saugumą iš naujo.</p>
      </div>

      <ConfirmModal
        isOpen={!!confirmType}
        title={cfg.title}
        message={cfg.message}
        confirmLabel={cfg.confirmLabel}
        danger={cfg.danger}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmType(null)}
      />
    </div>
  );
}
