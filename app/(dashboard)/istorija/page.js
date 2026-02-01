"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PacientoIstorija() {
  const [vizitai, setVizitai] = useState([]);
  const [activeTab, setActiveTab] = useState("future"); 
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasConfirmed = useRef(false);

  const fetchVizitai = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7237/api/Vizitai/mano-vizitai", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVizitai(data);
      }
    } catch (err) {
      console.error("Klaida kraunant vizitus:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    const vizitasId = searchParams.get("vizitasId");

    if (success === "true" && vizitasId && !hasConfirmed.current) {
      hasConfirmed.current = true;
      fetch(`https://localhost:7237/api/Vizitai/patvirtinti-apmokejima/${vizitasId}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      })
      .then((res) => {
        if (res.ok) {
          alert("Mokėjimas sėkmingas!");
          router.replace("/istorija");
          fetchVizitai();
        }
      });
    } else {
      fetchVizitai();
    }
  }, [fetchVizitai, searchParams, router]);

  const handlePayment = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${id}/sukurti-apmokejima`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }
    } catch (err) { alert("Sistemos klaida."); }
  };

  // --- ATŠAUKIMO FUNKCIJA SUGRĄŽINTA ---
  const handleCancel = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Ar tikrai norite atšaukti šį vizitą?")) return;
    try {
      const res = await fetch(`https://localhost:7237/api/Vizitai/${id}/atshaukti`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        alert("Vizitas atšauktas.");
        fetchVizitai();
      }
    } catch (err) { alert("Klaida atšaukiant."); }
  };

  const getGoogleCalendarUrl = (v) => {
    const start = new Date(v.pradziosLaikas).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(v.pradziosLaikas).getTime() + 30 * 60000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const procName = (v.atliktosProceduros || v.AtliktosProceduros)?.[0]?.pavadinimas || "Vizitas pas odontologą";
    const title = encodeURIComponent(`Odontologas: ${procName}`);
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&sf=true&output=xml`;
  };

  const dabar = new Date();
  const filteredVizitai = vizitai
    .filter(v => {
      const vData = new Date(v.pradziosLaikas);
      const isPaid = v.busena === "Apmokėta" || v.Busena === "Apmokėta";
      const isCanceled = v.busena === "Atšauktas" || v.Busena === "Atšauktas";

      if (isCanceled) return false; // Atšauktų nerodome visai
      if (activeTab === "paid") return isPaid;
      if (activeTab === "future") return vData >= dabar && !isPaid;
      if (activeTab === "past") return vData < dabar && !isPaid;
      return false;
    })
    .sort((a, b) => activeTab === "future" 
      ? new Date(a.pradziosLaikas) - new Date(b.pradziosLaikas)
      : new Date(b.pradziosLaikas) - new Date(a.pradziosLaikas)
    );

  const displayVizitai = filteredVizitai.slice(0, visibleCount);

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-2">Mano vizitai</h2>
          <p className="text-muted small">Spustelėkite ant kortelės detalėms</p>
        </div>

        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group bg-white shadow-sm p-1 rounded-pill border">
            {[{ id: "future", label: "Būsimi" }, { id: "past", label: "Atlikti" }, { id: "paid", label: "Apmokėti" }].map((tab) => (
              <button key={tab.id} className={`btn rounded-pill px-4 py-2 border-0 ${activeTab === tab.id ? "btn-primary shadow-sm" : "btn-light text-muted"}`} onClick={() => { setActiveTab(tab.id); setExpandedId(null); setVisibleCount(5); }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="row">
            {displayVizitai.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border mx-3"><h5 className="text-muted mb-0">Šioje skiltyje vizitų nėra</h5></div>
            ) : (
              displayVizitai.map((v) => (
                <div key={v.id} className="col-12 mb-3">
                  <div className={`card border-0 shadow-sm rounded-4 overflow-hidden clickable-card ${expandedId === v.id ? 'card-active' : ''}`} onClick={() => setExpandedId(expandedId === v.id ? null : v.id)} style={{ cursor: 'pointer' }}>
                    <div className="card-body p-4">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 text-primary rounded-4 p-3 text-center me-3" style={{ minWidth: '70px' }}>
                            <div className="small fw-bold text-uppercase">{new Date(v.pradziosLaikas).toLocaleDateString('lt-LT', { weekday: 'short' })}</div>
                            <div className="fs-4 fw-bold">{new Date(v.pradziosLaikas).getDate()}</div>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">{new Date(v.pradziosLaikas).toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' })} val.</h6>
                            <div className="text-muted small">👨‍⚕️ {v.gydytojoVardas}</div>
                            {activeTab === "paid" && <span className="badge bg-success-subtle text-success border border-success border-opacity-25 mt-1">✅ Apmokėta</span>}
                          </div>
                        </div>
                        <div className="text-md-end">
                          <div className="fw-bold text-primary fs-5">{v.bendraSuma} €</div>
                          <div className="text-muted small">{expandedId === v.id ? "Mažiau ▲" : "Detalės ▼"}</div>
                        </div>
                      </div>

                      {expandedId === v.id && (
                        <div className="mt-4 pt-3 border-top animate-fade-in" onClick={(e) => e.stopPropagation()}>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <h6 className="fw-bold small text-uppercase text-muted mb-2">Paslaugos</h6>
                              <ul className="list-unstyled small mb-0">
                                {(v.atliktosProceduros || v.AtliktosProceduros)?.map((p, i) => (
                                  <li key={i} className="d-flex justify-content-between py-1 border-bottom border-light">
                                    <span>{p.pavadinimas || p.Pavadinimas}</span>
                                    <span className="fw-bold">{p.kaina || p.Kaina} €</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="col-md-6 d-flex flex-column gap-2 justify-content-end">
                              {activeTab === "future" && (
                                <>
                                  <a href={getGoogleCalendarUrl(v)} target="_blank" className="btn btn-outline-dark btn-sm rounded-pill w-100 mb-1" onClick={(e) => e.stopPropagation()}>📅 Į kalendorių</a>
                                  <button className="btn btn-outline-danger btn-sm rounded-pill w-100" onClick={(e) => handleCancel(e, v.id)}>❌ Atšaukti vizitą</button>
                                </>
                              )}
                              {activeTab === "past" && (
                                <button className="btn btn-success btn-sm rounded-pill py-2 shadow-sm fw-bold w-100" onClick={(e) => handlePayment(e, v.id)}>💳 Apmokėti dabar</button>
                              )}
                              {activeTab === "paid" && (
                                <button className="btn btn-outline-secondary btn-sm rounded-pill py-2 fw-bold w-100" disabled>✅ Apmokėta</button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {filteredVizitai.length > visibleCount && (
              <div className="text-center mt-4"><button className="btn btn-white shadow-sm rounded-pill px-5 border" onClick={() => setVisibleCount(prev => prev + 5)}>Rodyti daugiau ({filteredVizitai.length - visibleCount})</button></div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`.clickable-card { transition: all 0.2s ease; border: 1px solid transparent !important; } .clickable-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; border-color: #dee2e6 !important; } .card-active { border-color: #0d6efd !important; background-color: #f8fbff; } .animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}