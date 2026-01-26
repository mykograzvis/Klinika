"use client";
import { useEffect, useState } from "react";

export default function PacientoIstorija() {
  const [vizitai, setVizitai] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // Kurį vizitą išskleisti

  useEffect(() => {
    fetch("https://localhost:7237/api/Vizitai/mano-vizitai", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => res.json())
    .then(data => setVizitai(data));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">📜 Mano vizitų istorija</h2>
      
      <div className="list-group shadow-sm">
        {vizitai.map((v) => (
          <div key={v.id} className="list-group-item list-group-item-action border-0 mb-2 rounded shadow-sm">
            <div 
              className="d-flex justify-content-between align-items-center cursor-pointer"
              style={{ cursor: "pointer" }}
              onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
            >
              <div>
                <span className={`badge ${v.busena === 'Atliktas' ? 'bg-success' : 'bg-primary'} me-2`}>
                  {v.busena}
                </span>
                <span className="fw-bold">{new Date(v.pradziosLaikas).toLocaleDateString('lt-LT')}</span>
                <span className="text-muted ms-3">Gydytojas: {v.gydytojoVardas}</span>
              </div>
              <div className="fw-bold text-primary">
                {v.bendraSuma} € {expandedId === v.id ? "▲" : "▼"}
              </div>
            </div>

            {/* IŠSKLEIDŽIAMA DALIS - PROCEDŪRŲ SĄRAŠAS */}
            {expandedId === v.id && (
              <div className="mt-3 p-3 bg-light rounded border-top">
                <h6 className="fw-bold mb-2">Atliktos procedūros:</h6>
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    {v.atliktosProceduros.map((p, index) => (
                      <tr key={index}>
                        <td>{p.pavadinimas}</td>
                        <td className="text-end">{p.kaina} €</td>
                      </tr>
                    ))}
                    <tr className="border-top fw-bold">
                      <td>Iš viso sumokėta:</td>
                      <td className="text-end text-success">{v.bendraSuma} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}