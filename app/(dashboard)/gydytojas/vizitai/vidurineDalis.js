import { useState } from "react";
import styles from "./vizitai.module.css";
import API_URL from '@/services/api';
import { useToast } from "@/context/ToastContext";

const PASLAUGOS = [
  { pavadinimas: "Dantų balinimas", kaina: 60 },
  { pavadinimas: "Implantas", kaina: 800 },
  { pavadinimas: "Plombavimas", kaina: 120 },
  { pavadinimas: "Kanalų gydymas", kaina: 150 },
  { pavadinimas: "Higiena", kaina: 50 },
  { pavadinimas: "Vaistų uždėjimas", kaina: 20 },
  { pavadinimas: "Nejautra", kaina: 15 },
  { pavadinimas: "Rovimas", kaina: 80 },
];

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

export default function AppointmentDetails({ selectedVizitas, fetchManoVizitai }) {
  const { success, error } = useToast();
  const [isFinishing, setIsFinishing]   = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying]         = useState(false);
  const [procedura, setProcedura]       = useState({ pavadinimas: "", kaina: "", aprasymas: "" });

  // Modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, proceduraId: null });

  const openConfirm = (type, proceduraId = null) => setConfirmModal({ open: true, type, proceduraId });
  const closeConfirm = () => setConfirmModal({ open: false, type: null, proceduraId: null });

  const isEditable   = !["Atliktas", "Atšauktas", "Apmokėta"].includes(selectedVizitas?.busena);
  const needsPayment = selectedVizitas?.busena === "Atliktas";
  const canDownload  = ["Atliktas", "Apmokėta"].includes(selectedVizitas?.busena);

  const proceduros = selectedVizitas?.atliktosProceduros || selectedVizitas?.AtliktosProceduros || [];
  const suma = selectedVizitas?.bendraSuma ?? proceduros.reduce((s, p) => s + (p.kaina || p.Kaina || 0), 0);

  const handlePavadinimasChange = e => {
    const val = e.target.value;
    const found = PASLAUGOS.find(p => p.pavadinimas === val);
    setProcedura(found
      ? { ...procedura, pavadinimas: val, kaina: found.kaina.toString() }
      : { ...procedura, pavadinimas: val }
    );
  };

  const handlePrideti = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/Proceduros`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ vizitasId: selectedVizitas.id, ...procedura, kaina: parseFloat(procedura.kaina) }),
    });
    if (res.ok) { setProcedura({ pavadinimas: "", kaina: "", aprasymas: "" }); fetchManoVizitai(); }
  };

  const handleTrinti = (id) => openConfirm("trinti", id);
  const handleUzbaigti = () => openConfirm("uzbaigti");
  const handleAtsaukti = () => openConfirm("atsaukti");
  const handleApmoketi = () => openConfirm("apmoketi");

  const handleConfirm = async () => {
    const { type, proceduraId } = confirmModal;
    closeConfirm();

    if (type === "trinti") {
      const res = await fetch(`${API_URL}/api/Proceduros/${proceduraId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) fetchManoVizitai();
    }

    if (type === "uzbaigti") {
      setIsFinishing(true);
      try {
        const res = await fetch(`${API_URL}/api/Vizitai/${selectedVizitas.id}/uzbaigti`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) { success("Vizitas užbaigtas", "Sąskaita išsiųsta el. paštu."); fetchManoVizitai(); }
      } finally { setIsFinishing(false); }
    }

    if (type === "atsaukti") {
      setIsCancelling(true);
      try {
        const res = await fetch(`${API_URL}/api/Vizitai/${selectedVizitas.id}/atsaukti-gydytojas`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) { success("Vizitas atšauktas", "Pacientas informuotas el. paštu."); fetchManoVizitai(); }
      } finally { setIsCancelling(false); }
    }

    if (type === "apmoketi") {
      setIsPaying(true);
      try {
        const res = await fetch(`${API_URL}/api/Vizitai/${selectedVizitas.id}/apmoketi`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.ok) { success("Mokėjimas užfiksuotas", "Vizitas pažymėtas kaip apmokėtas."); fetchManoVizitai(); }
      } finally { setIsPaying(false); }
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Vizitai/${selectedVizitas.id}/generuoti-pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `Saskaita_${selectedVizitas.id}.pdf`;
        document.body.appendChild(a); a.click();
        URL.revokeObjectURL(url); a.remove();
      }
    } catch { error("Klaida", "Nepavyko sugeneruoti PDF."); }
  };

  // Modal turinys pagal tipą
  const modalConfig = {
    trinti:   { title: "Pašalinti procedūrą?",    message: "Ši procedūra bus ištrinta iš vizito.",                                      confirmLabel: "Pašalinti",  danger: true  },
    uzbaigti: { title: "Užbaigti vizitą?",         message: "Pacientui bus išsiųsta sąskaita el. paštu. Veiksmo atšaukti negalėsite.",   confirmLabel: "Užbaigti",   danger: false },
    atsaukti: { title: "Atšaukti vizitą?",         message: "Pacientas bus informuotas el. paštu. Veiksmo atšaukti negalėsite.",         confirmLabel: "Atšaukti",   danger: true  },
    apmoketi: { title: "Patvirtinti apmokėjimą?",  message: "Patvirtinkite, kad pacientas atsiskaitė vietoje.",                          confirmLabel: "Patvirtinti", danger: false },
  };

  if (!selectedVizitas) return (
    <div className={`${styles.panel} ${styles.panelCenter} ${styles.panelEmpty}`}>
      <p className={styles.emptyHint}>Pasirinkite vizitą iš sąrašo kairėje.</p>
    </div>
  );

  const busenaCls =
    selectedVizitas.busena === "Apmokėta" ? styles.badgeGreen :
    selectedVizitas.busena === "Atliktas"  ? styles.badgeAmber :
    selectedVizitas.busena === "Atšauktas" ? styles.badgeRed   :
    styles.badgeBlue;

  const cfg = modalConfig[confirmModal.type] || {};

  return (
    <div className={`${styles.panel} ${styles.panelCenter}`}>
      <div className={styles.detailHeader}>
        <div>
          <h2 className={styles.patientName}>{selectedVizitas.pacientoVardas}</h2>
          <p className={styles.detailMeta}>
            #{selectedVizitas.id} &middot; {new Date(selectedVizitas.pradziosLaikas).toLocaleString("lt-LT")}
          </p>
        </div>
        <div className={styles.detailHeaderRight}>
          <span className={`${styles.badge} ${busenaCls}`}>{selectedVizitas.busena}</span>
          {canDownload && (
            <button className={styles.linkBtn} onClick={handleDownloadPdf}>Sąskaita PDF</button>
          )}
          {isEditable && (
            <button className={styles.linkBtnDanger} onClick={handleAtsaukti} disabled={isCancelling}>
              {isCancelling ? "Atšaukiama..." : "Atšaukti"}
            </button>
          )}
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.blockLabel}>Procedūros</p>
        {proceduros.length === 0 ? (
          <p className={styles.emptyHint}>Procedūrų nėra.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Paslauga</th>
                <th className={styles.textRight}>Kaina</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {proceduros.map((p, i) => (
                <tr key={i}>
                  <td>{p.pavadinimas || p.Pavadinimas}</td>
                  <td className={styles.textRight}>{(p.kaina || p.Kaina).toFixed(2)} €</td>
                  <td className={styles.textRight}>
                    {isEditable && (
                      <button className={styles.deleteRowBtn} onClick={() => handleTrinti(p.id || p.Id)}>×</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className={styles.sumaRow}>
          <span>Suma</span>
          <span className={styles.sumaVal}>{suma.toFixed(2)} €</span>
        </div>
      </div>

      {isEditable && (
        <div className={styles.block}>
          <p className={styles.blockLabel}>Pridėti procedūrą</p>
          <form onSubmit={handlePrideti} className={styles.addForm}>
            <input
              list="paslaugu-sarasas"
              type="text"
              className={styles.input}
              placeholder="Paslauga"
              required
              value={procedura.pavadinimas}
              onChange={handlePavadinimasChange}
            />
            <datalist id="paslaugu-sarasas">
              {PASLAUGOS.map((p, i) => <option key={i} value={p.pavadinimas} />)}
            </datalist>
            <input
              type="number"
              step="0.01"
              className={`${styles.input} ${styles.inputShort}`}
              placeholder="€"
              required
              value={procedura.kaina}
              onChange={e => setProcedura({ ...procedura, kaina: e.target.value })}
            />
            <button type="submit" className={styles.addBtn}>Pridėti</button>
          </form>

          <button
            className={styles.primaryBtn}
            onClick={handleUzbaigti}
            disabled={isFinishing || proceduros.length === 0}
          >
            {isFinishing ? "Užbaigiama..." : "Užbaigti vizitą ir siųsti sąskaitą"}
          </button>
        </div>
      )}

      {needsPayment && (
        <div className={styles.block}>
          <p className={styles.blockLabel}>Apmokėjimas</p>
          <p className={styles.hintText}>Vizitas atliktas. Patvirtinkite, jei pacientas atsiskaitė vietoje.</p>
          <button className={styles.primaryBtn} onClick={handleApmoketi} disabled={isPaying}>
            {isPaying ? "Fiksuojama..." : "Pažymėti kaip apmokėta"}
          </button>
        </div>
      )}

      {!isEditable && !needsPayment && (
        <div className={`${styles.block} ${selectedVizitas.busena === "Atšauktas" ? styles.blockCancelled : styles.blockDone}`}>
          {selectedVizitas.busena === "Atšauktas" ? "Vizitas atšauktas." : "Vizitas sėkmingai apmokėtas."}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.open}
        title={cfg.title}
        message={cfg.message}
        confirmLabel={cfg.confirmLabel}
        danger={cfg.danger}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}
