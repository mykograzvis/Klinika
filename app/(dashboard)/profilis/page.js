"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function ProfilisPage() {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [show2FAConfirm, setShow2FAConfirm] = useState(false);

  const [userData, setUserData] = useState({
    id: "", userId: "", vardas: "", pavarde: "", elPastas: "",
    telefonas: "", amzius: 0, kraujoGrupe: "", specializacija: "",
    darboPatirtisMetais: 0, role: "", isTwoFactorEnabled: false
  });

  const [passwordData, setPasswordData] = useState({
    senasSlaptazodis: "", naujasSlaptazodis: "", repeatSlaptazodis: ""
  });

  const [newEmail, setNewEmail] = useState("");

  useEffect(() => { fetchProfilis(); }, []);

  const fetchProfilis = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/profilis`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setUserData(await res.json());
    } catch (err) {
      console.error("Klaida kraunant profilį", err);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/atnaujinti`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(userData)
      });
      if (res.ok) { showMsg("Profilio duomenys sėkmingai atnaujinti!", "success"); setIsEditing(false); }
      else showMsg("Nepavyko atnaujinti duomenų.", "danger");
    } catch { showMsg("Serverio klaida.", "danger"); }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/keisti-el-pasta`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ naujasEmail: newEmail })
      });
      if (res.ok) {
        info("El. paštas pakeistas", "Prašome prisijungti iš naujo.");
        localStorage.clear();
        router.push("/login");
      } else {
        const txt = await res.text();
        showMsg(txt || "Klaida keičiant el. paštą.", "danger");
      }
    } catch { showMsg("Serverio klaida.", "danger"); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.naujasSlaptazodis !== passwordData.repeatSlaptazodis) {
      showMsg("Nauji slaptažodžiai nesutampa!", "danger");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Vartotojai/keisti-slaptazodi`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ senasSlaptazodis: passwordData.senasSlaptazodis, naujasSlaptazodis: passwordData.naujasSlaptazodis })
      });
      if (res.ok) {
        showMsg("Slaptažodis pakeistas!", "success");
        setShowPasswordForm(false);
        setPasswordData({ senasSlaptazodis: "", naujasSlaptazodis: "", repeatSlaptazodis: "" });
      } else {
        const errTxt = await res.text();
        showMsg(errTxt || "Klaida keičiant slaptažodį.", "danger");
      }
    } catch { showMsg("Serverio klaida.", "danger"); }
  };

  const handleConfirmDisable2FA = async () => {
    setShow2FAConfirm(false);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/Auth/disable-self-2fa`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        showMsg("2FA sėkmingai išjungtas.", "success");
        setUserData({ ...userData, isTwoFactorEnabled: false });
      } else {
        showMsg("Nepavyko išjungti 2FA.", "danger");
      }
    } catch { showMsg("Serverio klaida.", "danger"); }
  };

  const handleEnable2FA = () => {
    const id = userData.userId || userData.id || localStorage.getItem("userId");
    if (!id) { showMsg("Klaida: nepavyko nustatyti vartotojo ID.", "danger"); return; }
    router.push(`/setup-2fa?userId=${id}`);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}><h3>Kraunama...</h3></div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Mano Profilis</h1>
        <div style={{ padding: '5px 15px', backgroundColor: '#e2e8f0', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          {userData.role}
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '15px', marginBottom: '20px', borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#dcfce7' : '#fef2f2',
          color: message.type === 'success' ? '#166534' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Asmeniniai duomenys</h3>
          <button onClick={() => setIsEditing(!isEditing)} style={isEditing ? btnLightStyle : btnOutlineStyle}>
            {isEditing ? "Atšaukti" : "Redaguoti"}
          </button>
        </div>
        <form onSubmit={handleUpdateInfo}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <DataField label="Vardas" value={userData.vardas} isEditing={isEditing} onChange={v => setUserData({...userData, vardas: v})} />
            <DataField label="Pavardė" value={userData.pavarde} isEditing={isEditing} onChange={v => setUserData({...userData, pavarde: v})} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={labelStyle}>El. paštas</label>
              <div style={readonlyFieldStyle}>{userData.elPastas}</div>
            </div>
            <DataField label="Telefonas" value={userData.telefonas} isEditing={isEditing} onChange={v => setUserData({...userData, telefonas: v})} />
            <DataField label="Amžius" value={userData.amzius} isEditing={isEditing} type="number" onChange={v => setUserData({...userData, amzius: parseInt(v) || 0})} />
            <DataField label="Kraujo grupė" value={userData.kraujoGrupe} isEditing={isEditing} onChange={v => setUserData({...userData, kraujoGrupe: v})} />
            {userData.role === "Gydytojas" && (
              <>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Profesinė informacija</h4>
                </div>
                <DataField label="Specializacija" value={userData.specializacija} isEditing={isEditing} onChange={v => setUserData({...userData, specializacija: v})} />
                <DataField label="Patirtis (metais)" value={userData.darboPatirtisMetais} isEditing={isEditing} type="number" onChange={v => setUserData({...userData, darboPatirtisMetais: parseInt(v) || 0})} />
              </>
            )}
          </div>
          {isEditing && (
            <button type="submit" style={{ ...btnPrimaryStyle, marginTop: '20px' }}>Išsaugoti pakeitimus</button>
          )}
        </form>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginBottom: '20px' }}>Paskyros saugumas</h3>

        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
          {!showEmailForm ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>El. pašto adresas</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Keičiant el. paštą reikės prisijungti iš naujo</div>
              </div>
              <button onClick={() => setShowEmailForm(true)} style={btnLightStyle}>Keisti</button>
            </div>
          ) : (
            <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={labelStyle}>Naujas el. pašto adresas</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="email" style={inputStyle} value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
                <button type="submit" style={btnDarkStyle}>Atnaujinti</button>
                <button type="button" onClick={() => setShowEmailForm(false)} style={btnLightStyle}>Atšaukti</button>
              </div>
            </form>
          )}
        </div>

        <div style={{ paddingBottom: '20px', borderBottom: userData.role === "Pacientas" ? '1px solid #eee' : 'none', marginBottom: userData.role === "Pacientas" ? '20px' : '0' }}>
          {!showPasswordForm ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Slaptažodis</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>Paskyra geriau apsaugota naudojant unikalų slaptažodį</div>
              </div>
              <button onClick={() => setShowPasswordForm(true)} style={btnLightStyle}>Keisti</button>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="password" placeholder="Dabartinis slaptažodis" style={inputStyle} value={passwordData.senasSlaptazodis} onChange={e => setPasswordData({...passwordData, senasSlaptazodis: e.target.value})} required />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="password" placeholder="Naujas slaptažodis" style={inputStyle} value={passwordData.naujasSlaptazodis} onChange={e => setPasswordData({...passwordData, naujasSlaptazodis: e.target.value})} required />
                <input type="password" placeholder="Pakartokite naują" style={inputStyle} value={passwordData.repeatSlaptazodis} onChange={e => setPasswordData({...passwordData, repeatSlaptazodis: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={btnDarkStyle}>Atnaujinti slaptažodį</button>
                <button type="button" onClick={() => setShowPasswordForm(false)} style={btnLightStyle}>Atšaukti</button>
              </div>
            </form>
          )}
        </div>

        {userData.role === "Pacientas" && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div>
              <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Dviejų veiksnių autentifikavimas (2FA)
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '10px',
                  backgroundColor: userData.isTwoFactorEnabled ? '#dcfce7' : '#f1f5f9',
                  color: userData.isTwoFactorEnabled ? '#166534' : '#64748b'
                }}>
                  {userData.isTwoFactorEnabled ? "ĮJUNGTA" : "IŠJUNGTA"}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Papildoma apsauga naudojant programėlę telefone</div>
            </div>
            {userData.isTwoFactorEnabled ? (
              <button onClick={() => setShow2FAConfirm(true)} style={btnDangerStyle}>Išjungti 2FA</button>
            ) : (
              <button onClick={handleEnable2FA} style={btnPrimaryStyle}>Įjungti 2FA</button>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={show2FAConfirm}
        title="Išjungti 2FA?"
        message="Tai sumažins jūsų paskyros saugumą. Dviejų veiksnių autentifikacija bus išjungta."
        confirmLabel="Išjungti"
        danger
        onConfirm={handleConfirmDisable2FA}
        onCancel={() => setShow2FAConfirm(false)}
      />
    </div>
  );
}

function DataField({ label, value, isEditing, onChange, type = "text" }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={labelStyle}>{label}</label>
      {isEditing ? (
        <input type={type} style={{ ...inputStyle, borderColor: '#0070f3' }} value={value || ""} onChange={e => onChange(e.target.value)} />
      ) : (
        <div style={readonlyFieldStyle}>{value || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Nenurodyta</span>}</div>
      )}
    </div>
  );
}

const cardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none', fontSize: '14px', width: '100%' };
const readonlyFieldStyle = { padding: '8px 0', fontSize: '16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9', minHeight: '37px' };
const btnPrimaryStyle = { padding: '8px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const btnDarkStyle = { padding: '8px 20px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const btnLightStyle = { padding: '8px 20px', backgroundColor: '#f1f5f9', color: '#1e293b', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const btnOutlineStyle = { padding: '8px 20px', backgroundColor: 'transparent', color: '#0070f3', border: '1px solid #0070f3', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const btnDangerStyle = { padding: '8px 20px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
