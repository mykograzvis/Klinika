"use client";
import { useEffect, useState } from "react";

export default function GydytojoDarbalaukis() {
  const [vizitai, setVizitai] = useState([]);
  const [selectedVizitas, setSelectedVizitas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false); // Būsena siuntimo metu

  const [procedura, setProcedura] = useState({ 
    pavadinimas: "", 
    kaina: "", 
    aprasymas: "" 
  });

  useEffect(() => {
    fetchManoVizitai();
  }, []);

  const fetchManoVizitai = async () => {
    try {
      const res = await fetch("https://localhost:7237/api/Vizitai/mano-vizitai", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVizitai(data);
        if (selectedVizitas) {
          const atnaujintas = data.find(v => v.id === selectedVizitas.id);
          setSelectedVizitas(atnaujintas);
        }
      }
    } catch (err) {
      console.error("Klaida kraunant vizitus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUzbaigtiVizita = async () => {
    if (!selectedVizitas) return;
    if (!confirm("Ar tikrai norite užbaigti vizitą? Bus išsiųsta sąskaita el. paštu.")) return;

    setIsFinishing(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${selectedVizitas.id}/uzbaigti`, {
        method: "PATCH", // Naudok PATCH arba HTTPPATCH pagal savo kontrolerį
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        alert("Vizitas užbaigtas sėkmingai!");
        fetchManoVizitai();
      } else {
        alert("Klaida užbaigiant vizitą.");
      }
    } catch (err) {
      alert("Tinklo klaida.");
    } finally {
      setIsFinishing(false);
    }
  };

  const handlePridetiProcedura = async (e) => {
    e.preventDefault();
    const res = await fetch("https://localhost:7237/api/Proceduros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        vizitasId: selectedVizitas.id,
        pavadinimas: procedura.pavadinimas,
        kaina: parseFloat(procedura.kaina),
        aprasymas: procedura.aprasymas
      })
    });

    if (res.ok) {
      setProcedura({ pavadinimas: "", kaina: "", aprasymas: "" });
      fetchManoVizitai();
    }
  };

  const handleTrintiProcedura = async (id) => {
    if (!confirm("Ar tikrai norite pašalinti šią paslaugą?")) return;
    const res = await fetch(`https://localhost:7237/api/Proceduros/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) fetchManoVizitai();
  };

  if (loading) return <div className="p-5 text-center">Kraunami vizitai...</div>;

  return (
    <div className="container py-4">
      {/* CSS, kad spausdinant nesimatytų pašalinių elementų */}
      <style>{`
        @media print {
          .no-print, .btn, nav, form { display: none !important; }
          .card { border: none !important; box-shadow: none !important; }
          body { background: white; }
        }
      `}</style>

      <div className="row">
        <div className="col-12 no-print">
          <h2 className="fw-bold mb-4">🩺 Gydytojo kabinetas</h2>
        </div>
        
        {/* KAIRĖ PUSĖ: VIZITŲ SĄRAŠAS */}
        <div className="col-md-5 no-print">
          <h5 className="mb-3 text-muted">Vizitai</h5>
          {vizitai.map(v => (
            <div 
              key={v.id} 
              className={`card mb-3 shadow-sm transition-all ${selectedVizitas?.id === v.id ? 'border-primary border-2' : 'border-0'}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedVizitas(v)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-0">{v.pacientoVardas}</h6>
                    <small className="text-muted">{new Date(v.pradziosLaikas).toLocaleDateString()} {new Date(v.pradziosLaikas).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                  </div>
                  <span className={`badge ${v.busena === 'Atliktas' ? 'bg-success' : 'bg-primary'}`}>{v.bendraSuma} €</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DEŠINĖ PUSĖ: VALDYMAS */}
        <div className="col-md-7">
          {selectedVizitas ? (
            <div className="card shadow border-0 p-4 printable-area">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h4 className="fw-bold m-0">Vizito detalės</h4>
                  <small className="text-muted">ID: {selectedVizitas.id}</small>
                </div>
                <div className="no-print">
                  <button className="btn btn-outline-dark btn-sm me-2" onClick={() => window.print()}>🖨️ PDF</button>
                  <span className={`badge ${selectedVizitas.busena === 'Atliktas' ? 'bg-success' : 'bg-info text-dark'}`}>{selectedVizitas.busena}</span>
                </div>
              </div>

              <div className="bg-light p-3 rounded mb-4">
                <p className="mb-1"><b>Pacientas:</b> {selectedVizitas.pacientoVardas}</p>
                <p className="mb-1"><b>Data:</b> {new Date(selectedVizitas.pradziosLaikas).toLocaleString('lt-LT')}</p>
                {selectedVizitas.pastabos && <p className="mb-0 small"><b>Pastaba:</b> {selectedVizitas.pastabos}</p>}
              </div>

              <h6 className="fw-bold border-bottom pb-2">Atliktos procedūros</h6>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Paslauga</th>
                    <th className="text-end">Kaina</th>
                    <th className="no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVizitas.atliktosProceduros?.map((p) => (
                    <tr key={p.id || p.Id} className="align-middle">
                      <td>{p.pavadinimas || p.Pavadinimas}</td>
                      <td className="text-end">{p.kaina || p.Kaina} €</td>
                      <td className="text-end no-print">
                        {selectedVizitas.busena !== "Atliktas" && (
                          <button className="btn btn-link text-danger p-0" onClick={() => handleTrintiProcedura(p.id || p.Id)}>🗑️</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-light fw-bold text-end">
                    <td colSpan="2">Iš viso sumokėta: {selectedVizitas.bendraSuma} €</td>
                    <td className="no-print"></td>
                  </tr>
                </tbody>
              </table>

              {/* VALDYMO MYGTUKAI */}
              <div className="no-print">
                {selectedVizitas.busena !== "Atliktas" ? (
                  <>
                    <div className="mt-4 p-3 border rounded bg-white">
                      <h6 className="fw-bold mb-3 text-success">Pridėti paslaugą</h6>
                      <form onSubmit={handlePridetiProcedura}>
                        <div className="row g-2">
                          <div className="col-7"><input type="text" className="form-control form-control-sm" placeholder="Pavadinimas" required value={procedura.pavadinimas} onChange={e => setProcedura({...procedura, pavadinimas: e.target.value})} /></div>
                          <div className="col-3"><input type="number" className="form-control form-control-sm" placeholder="€" required value={procedura.kaina} onChange={e => setProcedura({...procedura, kaina: e.target.value})} /></div>
                          <div className="col-2"><button type="submit" className="btn btn-success btn-sm w-100">Pridėti</button></div>
                        </div>
                      </form>
                    </div>
                    <button 
                      className="btn btn-primary w-100 py-3 mt-4 fw-bold" 
                      onClick={handleUzbaigtiVizita}
                      disabled={isFinishing || selectedVizitas.atliktosProceduros?.length === 0}
                    >
                      {isFinishing ? "SIUNČIAMA SĄSKAITA..." : "✅ UŽBAIGTI VIZITĄ"}
                    </button>
                  </>
                ) : (
                  <div className="alert alert-success mt-4 text-center">
                    Vizitas sėkmingai užbaigtas. Sąskaita išsiųsta pacientui.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center border rounded bg-light" style={{ minHeight: "300px" }}>
              <p className="text-muted">Pasirinkite vizitą</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}