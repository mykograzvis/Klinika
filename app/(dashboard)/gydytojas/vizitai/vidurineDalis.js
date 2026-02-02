import { useState } from "react";

export default function AppointmentDetails({ selectedVizitas, fetchManoVizitai }) {
  const [isFinishing, setIsFinishing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false); // Naujas krovimosi būsenos state
  const [procedura, setProcedura] = useState({ pavadinimas: "", kaina: "", aprasymas: "" });

  const populiariosPaslaugos = [
    { pavadinimas: "Dantų balinimas", kaina: 60 },
    { pavadinimas: "Implantas", kaina: 800 },
    { pavadinimas: "Plombavimas", kaina: 120 },
    { pavadinimas: "Kanalų gydymas", kaina: 150 },
    { pavadinimas: "Higiena", kaina: 50 },
    { pavadinimas: "Vaistų uždėjimas", kaina: 20 },
    { pavadinimas: "Nejautra", kaina: 15 },
    { pavadinimas: "Rovimas", kaina: 80 },
  ];

  const isEditable = selectedVizitas?.busena !== "Atliktas" && 
                     selectedVizitas?.busena !== "Atšauktas" && 
                     selectedVizitas?.busena !== "Apmokėta";

  const canDownloadInvoice = selectedVizitas?.busena === "Atliktas" || 
                             selectedVizitas?.busena === "Apmokėta";

  // Tikriname, ar reikia rodyti apmokėjimo mygtuką
  const needsPayment = selectedVizitas?.busena === "Atliktas";

  const handleApmoketi = async () => {
    if (!confirm("Ar patvirtinate, kad pacientas atsiskaitė vietoje?")) return;
    setIsPaying(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/apmoketi`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Mokėjimas sėkmingai užfiksuotas!");
        fetchManoVizitai();
      }
    } catch (err) {
      alert("Klaida fiksuojant mokėjimą.");
    } finally {
      setIsPaying(false);
    }
  };

  // ... (handlePrideti, handleTrinti, handleUzbaigti, handleAtsaukti, handleDownloadPdf, handlePavadinimasChange funkcijos lieka tokios pat)

  const handlePrideti = async (e) => {
    e.preventDefault();
    const res = await fetch("https://localhost:7237/api/Proceduros", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      },
      body: JSON.stringify({ 
        vizitasId: selectedVizitas.id, 
        ...procedura, 
        kaina: parseFloat(procedura.kaina) 
      })
    });
    if (res.ok) { 
      setProcedura({ pavadinimas: "", kaina: "", aprasymas: "" }); 
      fetchManoVizitai(); 
    }
  };

  const handleTrinti = async (id) => {
    if (!confirm("Ar tikrai norite pašalinti šią paslaugą?")) return;
    const res = await fetch(`https://localhost:7237/api/Proceduros/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) fetchManoVizitai();
  };

  const handleUzbaigti = async () => {
    if (!confirm("Ar tikrai norite užbaigti vizitą? Bus išsiųsta sąskaita el. paštu.")) return;
    setIsFinishing(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/uzbaigti`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { 
        alert("Vizitas sėkmingai užbaigtas!"); 
        fetchManoVizitai(); 
      }
    } catch (err) { 
      alert("Klaida užbaigiant vizitą."); 
    } finally { 
      setIsFinishing(false); 
    }
  };

  const handleAtsaukti = async () => {
    if (!confirm("Ar tikrai norite ATŠAUKTI šį vizitą? Pacientas bus informuotas el. paštu.")) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/atsaukti-gydytojas`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) { 
        alert("Vizitas atšauktas."); 
        fetchManoVizitai(); 
      }
    } catch (err) { 
      alert("Klaida atšaukiant vizitą."); 
    } finally { 
      setIsCancelling(false); 
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/generuoti-pdf`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Saskaita_${selectedVizitas.id}_${selectedVizitas.pacientoVardas}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert("Nepavyko sugeneruoti PDF failo.");
      }
    } catch (err) {
      alert("Serverio klaida generuojant PDF.");
    }
  };

  const handlePavadinimasChange = (e) => {
    const verte = e.target.value;
    const rastaPaslauga = populiariosPaslaugos.find(p => p.pavadinimas === verte);
    if (rastaPaslauga) {
      setProcedura({ ...procedura, pavadinimas: verte, kaina: rastaPaslauga.kaina.toString() });
    } else {
      setProcedura({ ...procedura, pavadinimas: verte });
    }
  };

  if (!selectedVizitas) return (
    <div className="col-md-6 h-100 d-flex flex-column align-items-center justify-content-center text-center opacity-50 bg-white">
      <div className="display-1 mb-3">🏥</div>
      <h4>Pasirinkite pacientą iš sąrašo kairėje</h4>
    </div>
  );

  return (
    <div className="col-md-6 h-100 overflow-auto p-4 bg-white border-end shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="fw-bold mb-0 text-dark">{selectedVizitas.pacientoVardas}</h1>
          <p className="text-muted small">ID: {selectedVizitas.id} | {new Date(selectedVizitas.pradziosLaikas).toLocaleString('lt-LT')}</p>
        </div>
        
        <div className="text-end">
          <div className="mb-2 d-flex align-items-center justify-content-end gap-2">
            {canDownloadInvoice && (
              <button className="btn btn-outline-dark btn-sm rounded-pill px-3 shadow-sm" onClick={handleDownloadPdf}>
                📄 Sąskaita PDF
              </button>
            )}
            
            <span className={`badge py-2 px-3 rounded-pill ${
              selectedVizitas.busena === 'Apmokėta' ? 'bg-success' : 
              selectedVizitas.busena === 'Atliktas' ? 'bg-warning text-dark' : 
              selectedVizitas.busena === 'Atšauktas' ? 'bg-danger' : 'bg-info text-dark'
            }`}>
              {selectedVizitas.busena}
            </span>
          </div>
          
          {isEditable && (
            <button className="btn btn-link text-danger btn-sm p-0 fw-bold text-decoration-none" onClick={handleAtsaukti} disabled={isCancelling}>
              {isCancelling ? "Atšaukiama..." : "Atšaukti vizitą"}
            </button>
          )}
        </div>
      </div>

      {/* Procedūrų lentelė lieka tokia pati */}
      <div className="card border-0 bg-light rounded-4 p-4 mb-4 shadow-sm">
        <h6 className="fw-bold mb-4 text-muted small text-uppercase">Atliktos procedūros</h6>
        <table className="table table-borderless align-middle">
          <thead>
            <tr className="text-muted small border-bottom">
              <th>PASLAUGA</th>
              <th className="text-end">KAINA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(selectedVizitas.atliktosProceduros || selectedVizitas.AtliktosProceduros)?.map((p, i) => (
              <tr key={i} className="border-bottom border-white">
                <td className="py-3 fw-medium">{p.pavadinimas || p.Pavadinimas}</td>
                <td className="text-end fw-bold py-3 text-primary">{(p.kaina || p.Kaina).toFixed(2)} €</td>
                <td className="text-end">
                  {isEditable && (
                    <button className="btn btn-link text-danger p-0" onClick={() => handleTrinti(p.id || p.Id)}>🗑️</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end fs-2 fw-bold text-primary mt-2">
          Suma: {selectedVizitas.bendraSuma?.toFixed(2) || (selectedVizitas.atliktosProceduros || selectedVizitas.AtliktosProceduros)?.reduce((acc, curr) => acc + (curr.kaina || curr.Kaina), 0).toFixed(2)} €
        </div>
      </div>

      {/* VEIKSMŲ ZONA */}
      {isEditable ? (
        <div>
          <form onSubmit={handlePrideti} className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4 border">
            <h6 className="fw-bold mb-3 small text-muted text-uppercase">Pridėti procedūrą</h6>
            <div className="row g-2">
              <div className="col-7">
                <input list="paslaugu-sarasas" type="text" className="form-control bg-light border-0 py-2" placeholder="Paslauga..." required value={procedura.pavadinimas} onChange={handlePavadinimasChange} />
                <datalist id="paslaugu-sarasas">
                  {populiariosPaslaugos.map((p, index) => <option key={index} value={p.pavadinimas} />)}
                </datalist>
              </div>
              <div className="col-3">
                <input type="number" step="0.01" className="form-control bg-light border-0 py-2" placeholder="€" required value={procedura.kaina} onChange={e => setProcedura({...procedura, kaina: e.target.value})} />
              </div>
              <div className="col-2">
                <button type="submit" className="btn btn-success w-100 py-2 fw-bold">Pridėti</button>
              </div>
            </div>
          </form>
          
          <button className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow" onClick={handleUzbaigti} disabled={isFinishing || (selectedVizitas.atliktosProceduros || selectedVizitas.AtliktosProceduros)?.length === 0}>
            {isFinishing ? <span className="spinner-border spinner-border-sm me-2"></span> : "✅"} UŽBAIGTI VIZITĄ IR SIŲSTI SĄSKAITĄ
          </button>
        </div>
      ) : needsPayment ? (
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white border">
          <div className="d-flex align-items-center mb-3 text-warning">
            <span className="fs-4 me-2">⌛</span>
            <span className="fw-bold">Laukiama apmokėjimo</span>
          </div>
          <button className="btn btn-success w-100 py-3 rounded-4 fw-bold shadow" onClick={handleApmoketi} disabled={isPaying}>
            {isPaying ? <span className="spinner-border spinner-border-sm me-2"></span> : "💵"} PAŽYMĖTI, KAD APMOKĖTA VIETOJE
          </button>
          <p className="text-muted small text-center mt-3 mb-0">Paspaudus šį mygtuką, vizito būsena sistemoje pasikeis į „Apmokėta“.</p>
        </div>
      ) : (
        <div className={`alert ${selectedVizitas.busena === 'Atšauktas' ? 'alert-danger' : 'alert-success'} rounded-4 text-center p-4 border-0 shadow-sm`}>
          {selectedVizitas.busena === 'Atšauktas' ? "Šis vizitas yra atšauktas." : "Vizitas sėkmingai apmokėtas."}
        </div>
      )}
    </div>
  );
}