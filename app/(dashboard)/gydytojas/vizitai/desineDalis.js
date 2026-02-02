import { useState } from "react";

export default function PatientHistory({ selectedVizitas, visiVizitai }) {
  const [historySearch, setHistorySearch] = useState("");

  const istorija = visiVizitai.filter(v => 
    selectedVizitas && v.pacientoVardas === selectedVizitas.pacientoVardas && v.id !== selectedVizitas.id
  ).sort((a, b) => new Date(b.pradziosLaikas) - new Date(a.pradziosLaikas));

  const filtered = istorija.filter(h => {
    if (!historySearch) return true;
    const pros = h.atliktosProceduros || h.AtliktosProceduros || [];
    return pros.some(p => (p.pavadinimas || p.Pavadinimas).toLowerCase().includes(historySearch.toLowerCase()));
  });

  return (
    <div className="col-md-3 bg-light h-100 d-flex flex-column border-start no-print">
      <div className="p-3 bg-white border-bottom shadow-sm">
        <h6 className="mb-2 fw-bold small text-dark text-uppercase">Paciento istorija</h6>
        {selectedVizitas && (
          <div className="input-group input-group-sm">
            <input type="text" className="form-control bg-light border-0" placeholder="Ieškoti procedūros..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
          </div>
        )}
      </div>
      <div className="flex-grow-1 overflow-auto p-3">
        {selectedVizitas ? (
          filtered.map(h => (
            <div key={h.id} className="mb-3 p-3 bg-white rounded-4 shadow-sm border-start border-primary border-4 animate-fade-in">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-bold text-dark small">{new Date(h.pradziosLaikas).toLocaleDateString('lt-LT')}</div>
                <span className="badge bg-light text-primary border">{h.bendraSuma} €</span>
              </div>
              <div className="small text-muted">
                {(h.atliktosProceduros || h.AtliktosProceduros)?.map((p, i) => (
                  <div key={i} className="py-1 border-bottom border-light">• {p.pavadinimas || p.Pavadinimas}</div>
                ))}
              </div>
            </div>
          ))
        ) : <div className="text-center mt-5 text-muted small px-3">Pasirinkite pacientą istorijai matyti.</div>}
      </div>
    </div>
  );
}