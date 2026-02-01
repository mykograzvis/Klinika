"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Rezervacija() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const paslaugos = [
    { id: 1, pavadinimas: "Burnos higiena", kaina: 50, specializacija: "Burnos higienistas", trukmeMin: 60 },
    { id: 2, pavadinimas: "Danties plombavimas", kaina: 80, specializacija: "Gydytojas odontologas", trukmeMin: 60 },
    { id: 3, pavadinimas: "Danties šalinimas", kaina: 120, specializacija: "Burnos chirurgas", trukmeMin: 90 },
    { id: 4, pavadinimas: "Konsultacija", kaina: 30, specializacija: "Gydytojas odontologas", trukmeMin: 30 },
    { id: 5, pavadinimas: "Danties implantacija", kaina: 800, specializacija: "Burnos chirurgas", trukmeMin: 120 }
  ];

  const visiGalimiLaikai = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

  const artimiausiosDarboDienos = useMemo(() => {
    const dienos = [];
    let count = 0;
    let offset = 0;
    while (count < 20) {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dienos.push({
          pilna: d.toISOString().split("T")[0],
          diena: d.getDate(),
          savaitėsDiena: d.toLocaleDateString('lt-LT', { weekday: 'short' }),
        });
        count++;
      }
      offset++;
    }
    return dienos;
  }, []);

  const [visiGydytojai, setVisiGydytojai] = useState([]);
  const [filtruotiGydytojai, setFiltruotiGydytojai] = useState([]);
  const [uzimtiLaikai, setUzimtiLaikai] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paslaugaIndex: "",
    gydytojasId: "",
    data: artimiausiosDarboDienos[0].pilna,
    laikas: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://localhost:7237/api/Gydytojai", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVisiGydytojai(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.paslaugaIndex !== "") {
      const p = paslaugos[parseInt(formData.paslaugaIndex)];
      setFiltruotiGydytojai(visiGydytojai.filter(g => g.specializacija === p.specializacija));
    }
  }, [formData.paslaugaIndex, visiGydytojai]);

  useEffect(() => {
    if (formData.gydytojasId && formData.data) {
      const token = localStorage.getItem("token");
      fetch(`https://localhost:7237/api/Vizitai/uzimti-laikai?gydytojasId=${formData.gydytojasId}&data=${formData.data}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUzimtiLaikai(data))
        .catch(() => setUzimtiLaikai([]));
    }
  }, [formData.gydytojasId, formData.data]);

  const patikrintiArLaisva = (laikas) => {
    if (formData.paslaugaIndex === "") return false;
    const p = paslaugos[parseInt(formData.paslaugaIndex)];
    const blokuSkaicius = p.trukmeMin / 30;
    const pradziosIndex = visiGalimiLaikai.indexOf(laikas);
    if (pradziosIndex + blokuSkaicius > visiGalimiLaikai.length) return false;
    for (let i = 0; i < blokuSkaicius; i++) {
      if (uzimtiLaikai.includes(visiGalimiLaikai[pradziosIndex + i])) return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
        alert("Klaida: Nepavyko nustatyti vartotojo ID.");
        setLoading(false);
        return;
    }

    const parinktaPaslauga = paslaugos[parseInt(formData.paslaugaIndex)];

    const dto = {
      pacientasId: parseInt(storedUserId),
      gydytojasId: parseInt(formData.gydytojasId),
      pradziosLaikas: `${formData.data}T${formData.laikas}:00`,
      trukmeMin: parinktaPaslauga.trukmeMin, // PRIDĖTA: siunčiame realią trukmę (pvz. 120)
      procedurosPavadinimas: parinktaPaslauga.pavadinimas,
      procedurosKaina: parinktaPaslauga.kaina,
      pastabos: "Internetinė registracija"
    };

    try {
      const res = await fetch("https://localhost:7237/api/Vizitai/registruotis", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dto)
      });

      if (res.ok) {
        alert("Sėkmingai užsiregistravote!");
        router.push("/istorija");
      } else {
        const errorText = await res.text();
        alert("Klaida: " + errorText);
      }
    } catch (err) {
      alert("Nepavyko susisiekti su serveriu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const d = new Date(e.target.value);
    if (d.getDay() === 0 || d.getDay() === 6) {
      alert("Savaitgaliais nedirbame.");
      return;
    }
    setFormData({ ...formData, data: e.target.value, laikas: "" });
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-100 min-vh-100 bg-light py-4 d-flex flex-column align-items-center">
      <div className="px-3" style={{ width: '90%', maxWidth: '800px' }}>
        <h4 className="fw-bold text-center mb-4 text-secondary">Registracija vizitui</h4>

        {/* 1. PASLAUGA */}
        <div className="bg-white p-4 rounded-4 shadow-sm mb-3 border-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="text-uppercase fw-bold text-muted small">1. Paslauga</label>
            {formData.paslaugaIndex !== "" && (
              <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => setFormData({...formData, paslaugaIndex: "", gydytojasId: "", laikas: ""})}>
                Keisti
              </button>
            )}
          </div>

          {formData.paslaugaIndex === "" ? (
            <div className="animate-fade-in">
              {paslaugos.map((p, idx) => (
                <div 
                  key={p.id} 
                  className="d-flex justify-content-between align-items-center p-3 mb-2 border rounded-4 hover-select transition-all"
                  onClick={() => setFormData({...formData, paslaugaIndex: idx.toString()})}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div className="fw-bold">{p.pavadinimas}</div>
                    <small className="text-muted">⏱ {p.trukmeMin} min.</small>
                  </div>
                  <div className="fw-bold text-primary">{p.kaina} €</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 border border-primary bg-primary bg-opacity-10 rounded-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold fs-5 text-dark">{paslaugos[parseInt(formData.paslaugaIndex)].pavadinimas}</div>
                <div className="fw-bold fs-5 text-primary">{paslaugos[parseInt(formData.paslaugaIndex)].kaina} €</div>
              </div>
            </div>
          )}
        </div>

        {/* 2. SPECIALISTAS */}
        {formData.paslaugaIndex !== "" && (
          <div className="bg-white p-4 rounded-4 shadow-sm mb-3 animate-fade-in border-0">
            <label className="text-uppercase fw-bold text-muted small mb-3 d-block">2. Specialistas</label>
            <select 
              className="form-select form-select-lg py-3 border-2 rounded-4" 
              value={formData.gydytojasId}
              onChange={e => setFormData({...formData, gydytojasId: e.target.value})}
            >
              <option value="">Pasirinkite gydytoją...</option>
              {filtruotiGydytojai.map(g => (
                <option key={g.id} value={g.id}>{g.vardas} {g.pavarde}</option>
              ))}
            </select>
          </div>
        )}

        {/* 3. DATA IR LAIKAS */}
        {formData.gydytojasId && (
          <div className="bg-white p-4 rounded-4 shadow-sm animate-fade-in border-0">
            <div className="row align-items-center mb-4">
              <div className="col">
                <label className="text-uppercase fw-bold text-muted small m-0">3. Data</label>
              </div>
              <div className="col-auto">
                <input 
                  type="date" 
                  className="form-control form-control-sm border-primary text-primary fw-bold rounded-pill px-3"
                  value={formData.data}
                  onChange={handleDateChange} 
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mb-4">
              <button className="btn btn-light rounded-circle shadow-sm" style={{width: '35px', height: '35px', padding: 0}} onClick={() => scroll('left')}>‹</button>
              <div ref={scrollRef} className="d-flex gap-2 overflow-auto py-1" style={{ scrollbarWidth: 'none', whiteSpace: 'nowrap' }}>
                {artimiausiosDarboDienos.map((d) => (
                  <div
                    key={d.pilna}
                    onClick={() => setFormData({...formData, data: d.pilna, laikas: ""})}
                    className={`d-flex flex-column align-items-center justify-content-center border rounded-4 p-2 flex-shrink-0 transition-all ${formData.data === d.pilna ? 'bg-primary text-white border-primary shadow-sm scale-105' : 'bg-white text-muted'}`}
                    style={{ width: '65px', height: '75px', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 'bold' }}>{d.savaitėsDiena}</span>
                    <span className="fw-bold fs-5">{d.diena}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-light rounded-circle shadow-sm" style={{width: '35px', height: '35px', padding: 0}} onClick={() => scroll('right')}>›</button>
            </div>

            <label className="text-uppercase fw-bold text-muted small mb-3">4. Galimas laikas</label>
            <div className="time-grid mb-4">
              {visiGalimiLaikai.map(t => {
                const laisva = patikrintiArLaisva(t);
                return (
                  <button
                    key={t}
                    disabled={!laisva}
                    className={`btn py-2 fw-bold rounded-3 transition-all ${formData.laikas === t ? 'btn-primary shadow' : laisva ? 'btn-outline-primary' : 'btn-light text-muted opacity-50 border-0'}`}
                    onClick={() => setFormData({...formData, laikas: t})}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <button 
              className="btn btn-dark w-100 rounded-pill py-3 fw-bold shadow-lg mt-2" 
              disabled={!formData.laikas || loading}
              onClick={handleSubmit}
            >
              {loading ? "Kraunama..." : "PATVIRTINTI REZERVACIJĄ"}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (min-width: 500px) { .time-grid { grid-template-columns: repeat(4, 1fr); } }
        .hover-select:hover { background-color: #f0f7ff; border-color: #0d6efd !important; transform: translateY(-2px); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .scale-105 { transform: scale(1.05); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}