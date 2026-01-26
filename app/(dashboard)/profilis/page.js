"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" arba "danger"

  // Duomenų būsenos
  const [userData, setUserData] = useState({
    vardas: "", pavarde: "", elPastas: "", telefonas: "", 
    amzius: 0, kraujoGrupe: "", specializacija: "", 
    darboPatirtisMetais: 0, role: ""
  });

  const [passwordData, setPasswordData] = useState({
    senasSlaptazodis: "",
    naujasSlaptazodis: "",
    repeatSlaptazodis: ""
  });

  useEffect(() => {
    fetchProfilis();
  }, []);

  const fetchProfilis = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("https://localhost:7237/api/Vartotojai/profilis", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {
      console.error("Klaida kraunant profilį", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Bendrų duomenų atnaujinimas
  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7237/api/Vartotojai/atnaujinti", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(userData)
    });

    if (res.ok) {
      showMsg("Profilio duomenys sėkmingai atnaujinti!", "success");
    } else {
      showMsg("Nepavyko atnaujinti duomenų.", "danger");
    }
  };

  // 2. Slaptažodžio keitimas
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.naujasSlaptazodis !== passwordData.repeatSlaptazodis) {
      showMsg("Nauji slaptažodžiai nesutampa!", "danger");
      return;
    }

    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7237/api/Vartotojai/keisti-slaptazodi", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        senasSlaptazodis: passwordData.senasSlaptazodis,
        naujasSlaptazodis: passwordData.naujasSlaptazodis
      })
    });

    if (res.ok) {
      showMsg("Slaptažodis pakeistas!", "success");
      setPasswordData({ senasSlaptazodis: "", naujasSlaptazodis: "", repeatSlaptazodis: "" });
    } else {
      const errTxt = await res.text();
      showMsg(errTxt || "Klaida keičiant slaptažodį.", "danger");
    }
  };

  const [newEmail, setNewEmail] = useState("");

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail) return;

    const token = localStorage.getItem("token");
    const res = await fetch("https://localhost:7237/api/Vartotojai/keisti-el-pasta", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ naujasEmail: newEmail })
    });

    if (res.ok) {
      alert("El. paštas pakeistas. Prisijunkite iš naujo.");
      localStorage.removeItem("token"); // Išvalome seną tokeną
      router.push("/login"); // Nukreipiame į prisijungimą
    } else {
      const txt = await res.text();
      showMsg(txt || "Klaida keičiant el. paštą", "danger");
    }
  };

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  if (loading) return <div className="p-5">Kraunama...</div>;

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <h1 className="mb-4 fw-bold">Paskyros nustatymai</h1>

      {message.text && (
        <div className={`alert alert-${message.type} mb-4`} role="alert">
          {message.text}
        </div>
      )}

      {/* SEKCIJA 1: Bendra informacija */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4">
          <h5 className="card-title mb-4 fw-bold">Bendra informacija</h5>
          <form onSubmit={handleUpdateInfo}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small text-muted">Vardas</label>
                <input type="text" className="form-control" value={userData.vardas} 
                  onChange={e => setUserData({...userData, vardas: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Pavardė</label>
                <input type="text" className="form-control" value={userData.pavarde} 
                  onChange={e => setUserData({...userData, pavarde: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">El. paštas (Nekeičiamas)</label>
                <input type="email" className="form-control bg-light" value={userData.elPastas} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Telefonas</label>
                <input type="text" className="form-control" value={userData.telefonas} 
                  onChange={e => setUserData({...userData, telefonas: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Amžius</label>
                <input type="number" className="form-control" value={userData.amzius} 
                  onChange={e => setUserData({...userData, amzius: parseInt(e.target.value)})} />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Kraujo grupė</label>
                <input type="text" className="form-control" value={userData.kraujoGrupe || ""} 
                  onChange={e => setUserData({...userData, kraujoGrupe: e.target.value})} />
              </div>

              {/* Jei vartotojas yra gydytojas, rodomi papildomi laukai */}
              {userData.role === "Gydytojas" && (
                <>
                  <div className="col-md-12 mt-4 pt-3 border-top">
                    <h6 className="fw-bold">Gydytojo licencijos informacija</h6>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Specializacija</label>
                    <input type="text" className="form-control" value={userData.specializacija} 
                      onChange={e => setUserData({...userData, specializacija: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Darbo patirtis (metais)</label>
                    <input type="number" className="form-control" value={userData.darboPatirtisMetais} 
                      onChange={e => setUserData({...userData, darboPatirtisMetais: parseInt(e.target.value)})} />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn btn-primary mt-4 px-4 py-2 rounded-pill fw-bold">
              Išsaugoti pakeitimus
            </button>
          </form>
        </div>
      </div>

      {/* SEKCIJA: El. pašto keitimas */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body p-4">
          <h5 className="card-title mb-4 fw-bold">El. pašto adresas</h5>
          <form onSubmit={handleUpdateEmail}>
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label className="form-label small text-muted">Naujas el. pašto adresas</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="pavyzdys@mail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-dark w-100 rounded-pill fw-bold">
                  Atnaujinti paštą
                </button>
              </div>
            </div>
            <p className="small text-danger mt-2">
              * Pakeitus el. paštą, būsite atjungti nuo sistemos saugumo sumetimais.
            </p>
          </form>
        </div>
      </div>

      {/* SEKCIJA 2: Saugumas */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h5 className="card-title mb-4 fw-bold">Saugumas</h5>
          <form onSubmit={handleUpdatePassword}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label small text-muted">Dabartinis slaptažodis</label>
                <input type="password" name="senas" className="form-control" 
                  value={passwordData.senasSlaptazodis}
                  onChange={e => setPasswordData({...passwordData, senasSlaptazodis: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Naujas slaptažodis</label>
                <input type="password" name="naujas" className="form-control" 
                  value={passwordData.naujasSlaptazodis}
                  onChange={e => setPasswordData({...passwordData, naujasSlaptazodis: e.target.value})} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small text-muted">Pakartokite naują slaptažodį</label>
                <input type="password" name="kartoti" className="form-control" 
                  value={passwordData.repeatSlaptazodis}
                  onChange={e => setPasswordData({...passwordData, repeatSlaptazodis: e.target.value})} required />
              </div>
            </div>
            <button type="submit" className="btn btn-outline-dark mt-4 px-4 py-2 rounded-pill fw-bold">
              Keisti slaptažodį
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}