"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Rezervacija() {
  const router = useRouter();
  
  // --- KONFIGŪRACIJA (Galima vėliau perkelti į DB) ---
  const paslaugos = [
    { id: 1, pavadinimas: "Burnos higiena", kaina: 50, specializacija: "Burnos higienistas" },
    { id: 2, pavadinimas: "Danties plombavimas", kaina: 80, specializacija: "Gydytojas odontologas" },
    { id: 3, pavadinimas: "Danties šalinimas", kaina: 120, specializacija: "Burnos chirurgas" },
    { id: 4, pavadinimas: "Konsultacija", kaina: 30, specializacija: "Gydytojas odontologas" }
  ];

  const visiGalimiLaikai = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", 
    "15:00", "15:30", "16:00"
  ];

  // --- BŪSENOS ---
  const [visiGydytojai, setVisiGydytojai] = useState([]);
  const [filtruotiGydytojai, setFiltruotiGydytojai] = useState([]);
  const [uzimtiLaikai, setUzimtiLaikai] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    paslaugaIndex: "", // Masyvo indeksas
    gydytojasId: "",
    data: "",
    laikas: "08:00",
    pastabos: ""
  });

  // 1. Užkrauname visus gydytojus iš API
  useEffect(() => {
    fetchGydytojai();
  }, []);

  // 2. Filtruojame gydytojus, kai pasikeičia pasirinkta paslauga
  useEffect(() => {
    if (formData.paslaugaIndex !== "") {
      const pasirinkta = paslaugos[formData.paslaugaIndex];
      const filtrai = visiGydytojai.filter(g => 
        pasirinkta.specializacija === "Visi" || g.specializacija === pasirinkta.specializacija
      );
      setFiltruotiGydytojai(filtrai);
      setFormData(prev => ({ ...prev, gydytojasId: "" })); // Išvalom gydytoją, jei pasikeitė paslauga
    } else {
      setFiltruotiGydytojai([]);
    }
  }, [formData.paslaugaIndex, visiGydytojai]);

  // 3. Krauname užimtus laikus, kai pasirinktas gydytojas IR data
  useEffect(() => {
    if (formData.gydytojasId && formData.data) {
      fetchUzimtiLaikai();
    }
  }, [formData.gydytojasId, formData.data]);

  const fetchGydytojai = async () => {
    try {
      const res = await fetch("https://localhost:7237/api/Gydytojai", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setVisiGydytojai(await res.json());
    } catch (err) {
      console.error("Nepavyko gauti gydytojų:", err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchUzimtiLaikai = async () => {
    try {
      const res = await fetch(
        `https://localhost:7237/api/Vizitai/uzimti-laikai?gydytojasId=${formData.gydytojasId}&data=${formData.data}`,
        { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.ok) setUzimtiLaikai(await res.json());
    } catch (err) {
      console.error("Klaida kraunant užimtus laikus", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const pasirinktaPaslauga = paslaugos[formData.paslaugaIndex];

    const body = {
      pacientasId: parseInt(userId),
      gydytojasId: parseInt(formData.gydytojasId),
      pradziosLaikas: `${formData.data}T${formData.laikas}:00`,
      pastabos: formData.pastabos,
      procedurosPavadinimas: pasirinktaPaslauga.pavadinimas,
      procedurosKaina: pasirinktaPaslauga.kaina
    };

    try {
      const res = await fetch("https://localhost:7237/api/Vizitai/registruotis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert("✅ Rezervacija sėkminga!");
        router.push("/istorija");
      } else {
        const klaida = await res.text();
        alert("❌ Klaida: " + klaida);
      }
    } catch (err) {
      alert("❌ Serverio klaida.");
    } finally {
      setLoading(false);
    }
  };

  if (isInitialLoading) return <div className="p-5 text-center">Kraunama sistema...</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "650px" }}>
      <h2 className="fw-bold mb-4 text-center">🦷 Nauja Registracija</h2>
      
      <div className="card border-0 shadow-lg p-4 bg-white">
        <form onSubmit={handleSubmit}>
          
          {/* 1 ŽINGSNIS: PASLAUGA */}
          <div className="mb-3">
            <label className="form-label fw-bold">1. Pasirinkite paslaugą</label>
            <select 
              className="form-select form-select-lg shadow-sm" 
              required
              value={formData.paslaugaIndex}
              onChange={e => setFormData({...formData, paslaugaIndex: e.target.value})}
            >
              <option value="">-- Paslaugų sąrašas --</option>
              {paslaugos.map((p, index) => (
                <option key={p.id} value={index}>{p.pavadinimas} ({p.kaina} €)</option>
              ))}
            </select>
          </div>

          {/* 2 ŽINGSNIS: GYDYTOJAS */}
          <div className="mb-3">
            <label className="form-label fw-bold">2. Pasirinkite gydytoją</label>
            <select 
              className="form-select shadow-sm" 
              required
              disabled={!formData.paslaugaIndex}
              value={formData.gydytojasId}
              onChange={e => setFormData({...formData, gydytojasId: e.target.value})}
            >
              <option value="">-- Gydytojai pagal specializaciją --</option>
              {filtruotiGydytojai.map(g => (
                <option key={g.id} value={g.id}>{g.vardas} {g.pavarde} ({g.specializacija})</option>
              ))}
            </select>
            {formData.paslaugaIndex && filtruotiGydytojai.length === 0 && (
              <small className="text-danger">Atsiprašome, šiuo metu nėra laisvų šios srities specialistų.</small>
            )}
          </div>

          {/* 3 ŽINGSNIS: DATA IR LAIKAS */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">3. Pasirinkite datą</label>
              <input 
                type="date" 
                className="form-control shadow-sm" 
                required
                disabled={!formData.gydytojasId}
                min={new Date().toISOString().split("T")[0]}
                value={formData.data}
                onChange={e => setFormData({...formData, data: e.target.value})}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">4. Galimas laikas</label>
              <select 
                className="form-select shadow-sm"
                required
                disabled={!formData.data || !formData.gydytojasId}
                value={formData.laikas}
                onChange={e => setFormData({...formData, laikas: e.target.value})}
              >
                {visiGalimiLaikai.map(t => {
                  const isOccupied = uzimtiLaikai.includes(t);
                  return (
                    <option key={t} value={t} disabled={isOccupied}>
                      {t} {isOccupied ? "(Užimta)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Papildoma informacija</label>
            <textarea 
              className="form-control shadow-sm" 
              rows="2" 
              placeholder="Skausmas, jautrumas ar kiti pastebėjimai..."
              value={formData.pastabos}
              onChange={e => setFormData({...formData, pastabos: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 fw-bold shadow"
            disabled={loading || !formData.gydytojasId || !formData.data}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span> Registruojama...</>
            ) : "PATVIRTINTI VIZITĄ"}
          </button>
        </form>
      </div>
    </div>
  );
}