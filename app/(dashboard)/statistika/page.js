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
      }
    } catch (err) {
      console.error("Tinklo klaida:", err);
    } finally {
      setLoading(false);
    }
  };

  const eksportuotiIExcel = () => {
    if (!data) return;
    let csvRows = [
      "\uFEFFGydytojas;Vizitai;Pajamos", // UTF-8 BOM lietuviškoms raidėms
      ...data.gydytojuEfektyvumas.map(g => `${g.vardas};${g.vizitai};${g.pajamos}`)
    ];

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Klinikos_Ataskaita_${filtras.metai}_${filtras.menesis}.csv`;
    a.click();
  };

  if (loading && !data) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h1 className="fw-black display-5 text-dark mb-1">Finansinė Analitika</h1>
          <p className="text-muted fs-5">Klinikos rezultatų stebėjimas realiu laiku</p>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-light">
            <div className="d-flex gap-2">
              <select 
                className="form-select border-0 shadow-none bg-white" 
                value={filtras.menesis} 
                onChange={e => setFiltras({...filtras, menesis: parseInt(e.target.value)})}
              >
                {["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"].map((m, i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
              <input 
                type="number" 
                className="form-control border-0 shadow-none bg-white" 
                style={{ width: '120px' }}
                value={filtras.metai} 
                onChange={e => setFiltras({...filtras, metai: parseInt(e.target.value)})} 
              />
              <button className="btn btn-dark rounded-3 px-4" onClick={eksportuotiIExcel}>
                Eksportuoti
              </button>
            </div>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* KPI KORTELĖS */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-lg p-4 h-100" style={{background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)', color: 'white'}}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="fs-1">💰</span>
                  <span className="badge bg-white bg-opacity-25 rounded-pill">Mėnesio apyvarta</span>
                </div>
                <h2 className="display-6 fw-bold mb-1">{data.bendraSuma.toLocaleString()} €</h2>
                <p className="m-0 opacity-75 small">Tik patvirtintos ir užbaigtos sąskaitos</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 bg-white">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="fs-1">👥</span>
                  <span className="badge bg-light text-muted rounded-pill">Klientų bazė</span>
                </div>
                <h2 className="display-6 fw-bold mb-1 text-dark">{data.pacientuSkaicius}</h2>
                <p className="m-0 text-success small fw-medium">Unikalūs pacientai šį mėnesį</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100 bg-white border-start border-primary border-5">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="fs-1">📈</span>
                  <span className="badge bg-light text-muted rounded-pill">Pelningumas</span>
                </div>
                <h2 className="display-6 fw-bold mb-1 text-dark">
                  {data.pacientuSkaicius > 0 ? (data.bendraSuma / data.pacientuSkaicius).toFixed(0) : 0} €
                </h2>
                <p className="m-0 text-muted small">Vidutinė pajamų suma vienam pacientui</p>
              </div>
            </div>
          </div>

          <div className="row g-5">
            {/* GYDYTOJŲ LENTELĖ */}
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-sm p-4 border h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold m-0 text-dark">Gydytojų Našumas</h4>
                  <span className="text-muted small">Iš viso gydytojų: {data.gydytojuEfektyvumas.length}</span>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle border-0">
                    <thead className="bg-light">
                      <tr className="text-muted small text-uppercase">
                        <th className="border-0 py-3">Specialistas</th>
                        <th className="border-0 py-3 text-center">Vizitai</th>
                        <th className="border-0 py-3">Apyvartos dalis</th>
                        <th className="border-0 py-3 text-end">Suma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.gydytojuEfektyvumas.map((g, i) => (
                        <tr key={i}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="avatar me-3 bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                {g.vardas.charAt(0)}
                              </div>
                              <span className="fw-semibold text-dark">{g.vardas}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="fw-bold text-muted">{g.vizitai}</span>
                          </td>
                          <td style={{minWidth: '150px'}}>
                            <div className="progress rounded-pill" style={{height: '6px'}}>
                              <div 
                                className="progress-bar bg-primary" 
                                style={{ width: `${data.bendraSuma > 0 ? (g.pajamos / data.bendraSuma) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="text-end fw-bold text-dark">{g.pajamos.toLocaleString()} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* PASLAUGŲ ANALIZĖ */}
            <div className="col-lg-4">
              <div className="bg-dark text-white rounded-4 shadow-sm p-4 h-100">
                <h4 className="fw-bold mb-4">Top Paslaugos</h4>
                {data.topProceduros.length === 0 && <p className="text-muted">Šį mėnesį procedūrų neatlikta.</p>}
                {data.topProceduros.map((p, i) => (
                  <div key={i} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-light text-info text-uppercase">{p.pavadinimas}</span>
                      <span className="fw-bold">{p.suma.toLocaleString()} €</span>
                    </div>
                    <div className="progress bg-secondary bg-opacity-25" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar bg-info shadow-sm" 
                        role="progressbar" 
                        style={{ width: `${data.bendraSuma > 0 ? (p.suma / data.bendraSuma) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">{p.kiekis} kartai (-ų)</small>
                      <small className="text-info">{((p.suma / data.bendraSuma) * 100).toFixed(1)}%</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {data && data.gydytojuEfektyvumas.length === 0 && (
        <div className="text-center py-5">
          <div className="display-1 mb-4">📁</div>
          <h3 className="text-muted">Nėra duomenų apie {filtras.metai} m. {filtras.menesis} mėn.</h3>
          <p>Patikrinkite, ar yra užbaigtų vizitų šiame laikotarpyje.</p>
        </div>
      )}
    </div>
  );
}