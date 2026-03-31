import { useState } from "react";
import styles from "./vizitai.module.css";

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

export default function AppointmentDetails({ selectedVizitas, fetchManoVizitai }) {
  const [isFinishing, setIsFinishing]   = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying]         = useState(false);
  const [procedura, setProcedura]       = useState({ pavadinimas: "", kaina: "", aprasymas: "" });

  const isEditable    = !["Atliktas", "Atšauktas", "Apmokėta"].includes(selectedVizitas?.busena);
  const needsPayment  = selectedVizitas?.busena === "Atliktas";
  const canDownload   = ["Atliktas", "Apmokėta"].includes(selectedVizitas?.busena);

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
    const res = await fetch("https://localhost:7237/api/Proceduros", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ vizitasId: selectedVizitas.id, ...procedura, kaina: parseFloat(procedura.kaina) }),
    });
    if (res.ok) { setProcedura({ pavadinimas: "", kaina: "", aprasymas: "" }); fetchManoVizitai(); }
  };

  const handleTrinti = async id => {
    if (!confirm("Pašalinti šią procedūrą?")) return;
    const res = await fetch(`https://localhost:7237/api/Proceduros/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) fetchManoVizitai();
  };

  const handleUzbaigti = async () => {
    if (!confirm("Užbaigti vizitą? Bus išsiųsta sąskaita el. paštu.")) return;
    setIsFinishing(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/uzbaigti`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) { alert("Vizitas užbaigtas."); fetchManoVizitai(); }
    } finally { setIsFinishing(false); }
  };

  const handleAtsaukti = async () => {
    if (!confirm("Atšaukti vizitą? Pacientas bus informuotas el. paštu.")) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/atsaukti-gydytojas`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) { alert("Vizitas atšauktas."); fetchManoVizitai(); }
    } finally { setIsCancelling(false); }
  };

  const handleApmoketi = async () => {
    if (!confirm("Patvirtinti, kad pacientas atsiskaitė vietoje?")) return;
    setIsPaying(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/apmoketi`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) { alert("Mokėjimas užfiksuotas."); fetchManoVizitai(); }
    } finally { setIsPaying(false); }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/generuoti-pdf`, {
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
    } catch { alert("Klaida generuojant PDF."); }
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

  return (
    <div className={`${styles.panel} ${styles.panelCenter}`}>
      {/* Header */}
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

      {/* Procedūros */}
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

      {/* Veiksmai */}
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
    </div>
  );
}
