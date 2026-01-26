"use client";
import { useEffect, useState } from "react";

export default function AdminAnalize() {
  const dabar = new Date();
  const [filtras, setFiltras] = useState({ 
    metai: dabar.getFullYear(), 
    menesis: dabar.getMonth() + 1 
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalize();
  }, [filtras]);

  const fetchAnalize = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://localhost:7237/api/Statistika/analize?metai=${filtras.metai}&menesis=${filtras.menesis}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      
      if (res.ok) {
        setData(await res.json());
      } else {
        console.error("Klaida gaunant duomenis:", res.status);
      }
    } catch (err) {
      console.error("Tinklo klaida:", err);
    } finally {
      setLoading(false);
    }
  };

  const eksportuotiIExcel = () => {
    if (!data || !data.gydytojuEfektyvumas) return;

    let csvRows = [];
    csvRows.push("Gydytojas;Vizitai;Pajamos"); // Antraštė

    data.gydytojuEfektyvumas.forEach(g => {
      csvRows.push(`${g.vardas};${g.vizitai};${g.pajamos} EUR`);
    });

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Klinikos_Analize_${filtras.metai}_${filtras.menesis}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading && !data) return <div className="p-5 text-center">Kraunama analitika...</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold m-0">📊 Verslo analitika</h2>
          <p className="text-muted m-0">Stebėkite klinikos veiklos rodiklius</p>
        </div>
        
        <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-outline-success d-flex align-items-center gap-2" onClick={eksportuotiIExcel}>
            📥 <span className="d-none d-md-inline">Eksportuoti</span>
          </button>
          
          <select 
            className="form-select w-auto" 
            value={filtras.menesis} 
            onChange={e => setFiltras({...filtras, menesis: parseInt(e.target.value)})}
          >
            {["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"].map((m, i) => (
              <option key={i+1} value={i+1}>{m}</option>
            ))}
          </select>
          
          <input 
            type="number" 
            className="form-control w-auto" 
            style={{ width: '100px' }}
            value={filtras.metai} 
            onChange={e => setFiltras({...filtras, metai: parseInt(e.target.value)})} 
          />
        </div>
      </div>

      {data && (
        <>
          {/* PAGRINDINĖS KORTELĖS */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4 bg-primary text-white h-100">
                <h6 className="text-uppercase opacity-75 small fw-bold mb-2">Mėnesio pajamos</h6>
                <h2 className="fw-bold m-0">{data.bendraSuma} €</h2>
                <div className="mt-3 small opacity-75">Tik užbaigti vizitai</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4 h-100">
                <h6 className="text-uppercase text-muted small fw-bold mb-2">Unikalūs pacientai</h6>
                <h2 className="fw-bold m-0 text-dark">{data.pacientuSkaicius}</h2>
                <div className="mt-3 small text-success">↑ Aktyvūs šį mėnesį</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 p-4 h-100">
                <h6 className="text-uppercase text-muted small fw-bold mb-2">Vidutinė vizito vertė</h6>
                <h2 className="fw-bold m-0 text-dark">
                  {data.pacientuSkaicius > 0 ? (data.bendraSuma / data.pacientuSkaicius).toFixed(2) : 0} €
                </h2>
                <div className="mt-3 small text-muted">Vienam pacientui</div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* GYDYTOJŲ EFEKTYVUMAS */}
            <div className="col-lg-7">
              <div className="card shadow-sm border-0 p-4 h-100">
                <h5 className="fw-bold mb-4">🩺 Gydytojų rezultatai</h5>
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Gydytojas</th>
                        <th className="text-center">Vizitai</th>
                        <th className="text-end">Sugeneruota pajamų</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.gydytojuEfektyvumas.map((g, i) => (
                        <tr key={i}>
                          <td className="fw-medium">{g.vardas}</td>
                          <td className="text-center">
                            <span className="badge bg-light text-dark border">{g.vizitai}</span>
                          </td>
                          <td className="text-end fw-bold text-primary">{g.pajamos} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* TOP PASLAUGOS */}
            <div className="col-lg-5">
              <div className="card shadow-sm border-0 p-4 h-100">
                <h5 className="fw-bold mb-4">🏆 Populiariausios paslaugos</h5>
                {data.topProceduros.length === 0 && <p className="text-muted">Duomenų nėra</p>}
                {data.topProceduros.map((p, i) => (
                  <div key={i} className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold small">{p.pavadinimas}</span>
                      <span className="text-muted small">{p.suma} €</span>
                    </div>
                    <div className="progress" style={{ height: "12px" }}>
                      <div 
                        className="progress-bar bg-info" 
                        role="progressbar" 
                        style={{ width: `${data.bendraSuma > 0 ? (p.suma / data.bendraSuma) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="text-end mt-1">
                      <small className="text-muted italic">{p.kiekis} kartų</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {data && data.gydytojuEfektyvumas.length === 0 && !loading && (
        <div className="alert alert-info mt-4 text-center">
          Pasirinktą laikotarpį užbaigtų vizitų nerasta.
        </div>
      )}
    </div>
  );
}