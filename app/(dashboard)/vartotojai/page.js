"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VartotojuSarasas() {
  const [vartotojai, setVartotojai] = useState([]);
  const [paieska, setPaieska] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://localhost:7237/api/Vartotojai", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVartotojai(data);
      }
    } catch (err) {
      console.error("Klaida:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtravimo logika: tikriname el. paštą ir pavardę
  const filtruotiVartotojai = vartotojai.filter(u => 
    u.elPastas?.toLowerCase().includes(paieska.toLowerCase()) ||
    u.pavarde?.toLowerCase().includes(paieska.toLowerCase())
  );

  if (loading) return <div className="p-5 text-center">Kraunama...</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "1100px", fontFamily: 'sans-serif' }}>
      
      {/* Viršutinė dalis: Antraštė ir Gydytojų kūrimas */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Vartotojų valdymas</h2>
          <p className="text-muted small m-0">Iš viso sistemoje: {vartotojai.length}</p>
        </div>
        <Link href="/gydytoju-valdymas" className="btn btn-success rounded-pill px-4 fw-bold shadow-sm">
          + Sukurti Gydytoją
        </Link>
      </div>

      {/* Paieškos juosta */}
      <div className="card border-0 shadow-sm mb-4 p-3 bg-light rounded-4">
        <div className="input-group">
          <span className="input-group-text bg-white border-0 ps-3">🔍</span>
          <input 
            type="text" 
            className="form-control border-0 shadow-none py-2" 
            placeholder="Ieškoti pagal el. paštą arba pavardę..." 
            value={paieska}
            onChange={(e) => setPaieska(e.target.value)}
          />
        </div>
      </div>

      {/* Vartotojų lentelė */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 bg-white">
            <thead className="bg-dark text-white">
              <tr>
                <th className="ps-4 py-3">ID</th>
                <th className="py-3">Vardas Pavardė</th>
                <th className="py-3">El. paštas</th>
                <th className="py-3">Rolė</th>
                <th className="py-3 text-center">Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {filtruotiVartotojai.length > 0 ? (
                filtruotiVartotojai.map(u => (
                  <tr key={u.id}>
                    <td className="ps-4 text-muted small">{u.id}</td>
                    <td>
                      <div className="fw-bold">{u.vardas} {u.pavarde}</div>
                    </td>
                    <td>{u.elPastas}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${
                        u.role === "Adminas" ? "bg-danger text-white" : 
                        u.role === "Gydytojas" ? "bg-primary text-white" : "bg-secondary text-white"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-center">
                      <Link 
                        href={`/vartotojai/redaguoti/${u.id || u.userId}`} 
                        className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold"
                      >
                        Valdyti
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Vartotojų pagal jūsų paiešką nerasta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}