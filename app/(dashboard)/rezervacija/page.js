"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Rezervacija() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const dateInputRef = useRef(null);

  // --- DUOMENYS ---
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
          menuo: d.toLocaleDateString('lt-LT', { month: 'short' })
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
  const [formData, setFormData] = useState({
    paslaugaIndex: "",
    gydytojasId: "",
    data: artimiausiosDarboDienos[0].pilna,
    laikas: ""
  });

  const handleDateChange = (e) => {
    const d = new Date(e.target.value);
    if (d.getDay() === 0 || d.getDay() === 6) {
      alert("Savaitgaliais nedirbame.");
      return;
    }
    setFormData({ ...formData, data: e.target.value, laikas: "" });
  };

  useEffect(() => { 
    // Čia įdėk savo fetch logiką
    // fetch("...")...
  }, []);

  // Fiktyvus filtravimas pavyzdžiui (pakeisk į savo useEffect)
  useEffect(() => {
    if (formData.paslaugaIndex !== "") {
      // čia tavo filtravimo logika
    }
  }, [formData.paslaugaIndex]);


  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -150 : 150;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    // PAGRINDINIS KONTEINERIS - Cia naudojame 'd-flex flex-column' vietoje 'row'
    <div className="w-100 min-vh-100 bg-light py-3 d-flex flex-column align-items-center">
      
      {/* 1. ANTRAŠTĖ */}
      <div className="w-100 px-3 mb-3" style={{ maxWidth: '800px' }}>
        <h4 className="fw-bold text-center m-0">Registracija</h4>
      </div>

      {/* 2. TURINYS (be jokių row/col) */}
      <div className="w-100 px-3 d-flex flex-column gap-3" style={{ maxWidth: '800px' }}>
        
        {/* KORTELĖ 1: PASLAUGOS */}
        <div className="bg-white p-3 rounded-4 shadow-sm w-100">
          <label className="text-uppercase fw-bold text-muted small mb-2">1. Paslauga</label>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {paslaugos.map((p, idx) => (
              <div 
                key={p.id} 
                className={`d-flex justify-content-between align-items-center p-3 mb-2 border rounded-3 ${formData.paslaugaIndex === idx.toString() ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                onClick={() => setFormData({...formData, paslaugaIndex: idx.toString()})}
                style={{ cursor: 'pointer' }}
              >
                <span className="fw-bold small">{p.pavadinimas}</span>
                <span className="text-primary fw-bold">{p.kaina} €</span>
              </div>
            ))}
          </div>

          {formData.paslaugaIndex !== "" && (
            <div className="mt-3 animate-fade-in">
              <label className="text-uppercase fw-bold text-muted small mb-2">2. Specialistas</label>
              <select className="form-select py-2" onChange={e => setFormData({...formData, gydytojasId: e.target.value})}>
                <option value="">Pasirinkite...</option>
                <option value="1">Gyd. Jonas Jonaitis</option>
              </select>
            </div>
          )}
        </div>

        {/* KORTELĖ 2: DATA IR LAIKAS */}
        {formData.gydytojasId && (
          <div className="bg-white p-3 rounded-4 shadow-sm w-100 animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <label className="text-uppercase fw-bold text-muted small m-0">3. Data</label>
              <button className="btn btn-sm text-primary fw-bold" onClick={() => dateInputRef.current.showPicker()}>
                📅 Kalendorius
              </button>
              <input type="date" ref={dateInputRef} className="d-none" onChange={handleDateChange} />
            </div>

            {/* DATŲ JUOSTA */}
            <div className="d-flex align-items-center gap-1 mb-4 w-100">
              <button className="btn btn-light rounded-circle flex-shrink-0" style={{width: '32px', height: '32px', padding: 0}} onClick={() => scroll('left')}>‹</button>
              
              <div ref={scrollRef} className="d-flex gap-2 overflow-auto w-100" style={{ scrollbarWidth: 'none', whiteSpace: 'nowrap' }}>
                {artimiausiosDarboDienos.map((d) => (
                  <div
                    key={d.pilna}
                    onClick={() => setFormData({...formData, data: d.pilna, laikas: ""})}
                    className={`d-flex flex-column align-items-center justify-content-center border rounded-4 p-2 flex-shrink-0 ${formData.data === d.pilna ? 'bg-primary text-white border-primary' : 'bg-white'}`}
                    style={{ width: '60px', height: '75px', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>{d.savaitėsDiena}</span>
                    <span className="fw-bold fs-5">{d.diena}</span>
                  </div>
                ))}
              </div>

              <button className="btn btn-light rounded-circle flex-shrink-0" style={{width: '32px', height: '32px', padding: 0}} onClick={() => scroll('right')}>›</button>
            </div>

            {/* LAIKO TINKLELIS */}
            <label className="text-uppercase fw-bold text-muted small mb-2">4. Laikas</label>
            <div className="time-grid w-100">
              {visiGalimiLaikai.map(t => (
                <button
                  key={t}
                  className={`btn w-100 py-2 fw-bold ${formData.laikas === t ? 'btn-primary' : 'btn-outline-primary'}`}
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => setFormData({...formData, laikas: t})}
                >
                  {t}
                </button>
              ))}
            </div>

            <button className="btn btn-dark w-100 rounded-pill py-3 mt-4 fw-bold shadow" disabled={!formData.laikas}>
              PATVIRTINTI
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        /* CSS Grid tinklelis laikams - prisitaiko automatiškai */
        .time-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* Telefone: 3 stulpeliai */
          gap: 8px;
        }

        /* Nuo planšetės dydžio (768px) darome 4 stulpelius */
        @media (min-width: 768px) {
          .time-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Paslepia scrollbar, bet leidžia scrollinti */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}