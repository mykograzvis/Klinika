"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminRedaguotiVartotoja() {
  const { id } = useParams();
  const router = useRouter();
  
  // Būsenos
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. Saugumo patikra Frontende
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || role !== "Adminas") {
      alert("Prieiga uždrausta. Tik administratoriai gali redaguoti vartotojus.");
      router.push("/dashboard");
      return;
    }

    setIsAuthorized(true);
    fetchUser(token);
  }, [id, router]);

  const fetchUser = async (token) => {
    try {
      const res = await fetch(`https://localhost:7237/api/Vartotojai/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      } else {
        alert("Vartotojas nerastas arba įvyko klaida.");
        router.push("/vartotojai");
      }
    } catch (err) {
      console.error("Klaida siunčiant užklausą:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`https://localhost:7237/api/Vartotojai/admin-atnaujinti/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(userData)
    });

    if (res.ok) {
      alert("Duomenys sėkmingai atnaujinti!");
      router.push("/vartotojai");
    } else {
      alert("Nepavyko atnaujinti duomenų.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("DĖMESIO: Ar tikrai norite ištrinti šį vartotoją visam laikui?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`https://localhost:7237/api/Vartotojai/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      alert("Vartotojas pašalintas.");
      router.push("/vartotojai");
    } else {
      const msg = await res.text();
      alert(msg || "Klaida trinant vartotoją.");
    }
  };

  const [accessData, setAccessData] = useState({ naujasEmail: "", naujasSlaptazodis: "" });

// Funkcija užklausai siųsti:
const handleUpdateAccess = async (e) => {
  e.preventDefault();
  if (!confirm("Ar tikrai norite pakeisti vartotojo prisijungimo duomenis?")) return;

  const token = localStorage.getItem("token");
  const res = await fetch(`https://localhost:7237/api/Vartotojai/admin-atnaujinti-prieiga/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token}` 
    },
    body: JSON.stringify(accessData)
  });

  if (res.ok) {
    alert("Prieigos duomenys pakeisti!");
    setAccessData({ naujasEmail: "", naujasSlaptazodis: "" }); // išvalom laukus
    fetchUser(token); // atnaujinam info ekrane
  } else {
    alert("Klaida atnaujinant duomenis.");
  }
};

  // Kol tikrinamos teisės arba kraunami duomenys
  if (loading || !isAuthorized) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Kraunama...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      {/* Duonos trupiniai (Breadcrumbs) - patogu navigacijai */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="#" onClick={() => router.push('/vartotojai')}>Vartotojai</a></li>
          <li className="breadcrumb-item active">Redagavimas</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Redaguoti profilį</h3>
          <p className="text-muted small">{userData.elPastas} ({userData.role})</p>
        </div>
        <button onClick={handleDelete} className="btn btn-outline-danger shadow-sm">
          Ištrinti paskyrą
        </button>
      </div>

      <form onSubmit={handleUpdate} className="card p-4 shadow-sm border-0 bg-white">
        <h5 className="mb-4 fw-bold">Asmeninė informacija</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small text-muted">Vardas</label>
            <input 
              className="form-control" 
              value={userData.vardas || ""} 
              onChange={e => setUserData({...userData, vardas: e.target.value})} 
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted">Pavardė</label>
            <input 
              className="form-control" 
              value={userData.pavarde || ""} 
              onChange={e => setUserData({...userData, pavarde: e.target.value})} 
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small text-muted">Telefonas</label>
            <input 
              className="form-control" 
              value={userData.telefonas || ""} 
              onChange={e => setUserData({...userData, telefonas: e.target.value})} 
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted">Amžius</label>
            <input 
              type="number" 
              className="form-control" 
              value={userData.amzius || 0} 
              onChange={e => setUserData({...userData, amzius: parseInt(e.target.value) || 0})} 
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted">Kraujo grupė</label>
            <input 
              className="form-control" 
              value={userData.kraujoGrupe || ""} 
              onChange={e => setUserData({...userData, kraujoGrupe: e.target.value})} 
            />
          </div>

          {/* Gydytojo specifiniai laukai - rodomi tik jei rolė atitinka */}
          {userData.role === "Gydytojas" && (
            <>
              <div className="col-12 mt-4">
                <h5 className="fw-bold">Gydytojo informacija</h5>
                <hr />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Specializacija</label>
                <input 
                  className="form-control" 
                  value={userData.specializacija || ""} 
                  onChange={e => setUserData({...userData, specializacija: e.target.value})} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Patirtis (metais)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={userData.darboPatirtisMetais || 0} 
                  onChange={e => setUserData({...userData, darboPatirtisMetais: parseInt(e.target.value) || 0})} 
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-5 d-flex gap-2">
          <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow-sm">
            Išsaugoti pakeitimus
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-light px-4 py-2 rounded-pill border">
            Atšaukti
          </button>
        </div>

        <div className="card p-4 shadow-sm border-0 bg-white mt-4 border-top border-warning border-4">
      <h5 className="fw-bold text-danger">⚠️ Paskyros prieigos valdymas (Tik Admin)</h5>
      <p className="small text-muted">Naudokite šią sekciją, jei vartotojas pamiršo slaptažodį arba nori pakeisti el. paštą.</p>
      
      <form onSubmit={handleUpdateAccess}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small">Naujas el. paštas</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="palikite tuščią, jei nekeičiate"
              value={accessData.naujasEmail}
              onChange={e => setAccessData({...accessData, naujasEmail: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Naujas slaptažodis</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="įrašykite naują slaptažodį"
              value={accessData.naujasSlaptazodis}
              onChange={e => setAccessData({...accessData, naujasSlaptazodis: e.target.value})}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-warning mt-3 fw-bold shadow-sm">
          Atnaujinti prisijungimo duomenis
        </button>
      </form>
    </div>
      </form>
    </div>
  );
}