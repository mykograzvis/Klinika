"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PagrindinisPuslapis() {
  const [vartotojas, setVartotojas] = useState(null);

  useEffect(() => {
    // Patikriname, ar vartotojas prisijungęs (pvz., iš saugomo tokeno ar localStorage)
    const role = localStorage.getItem("role");
    const vardas = localStorage.getItem("userName"); // Jei saugai vardą po login
    if (role) {
      setVartotojas({ role, vardas });
    }
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* HERO SEKCIJA */}
      <header className="bg-primary text-white py-5 shadow-sm">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-3 fw-bold mb-3">Sveiki atvykę į OdontoPro</h1>
              <p className="lead mb-4 opacity-90">
                Šiuolaikinė odontologijos klinikos valdymo sistema. Viskas vienoje vietoje – nuo registracijos iki detalių finansinių ataskaitų.
              </p>
              {!vartotojas ? (
                <div className="d-flex gap-3">
                  <Link href="/login" className="btn btn-light btn-lg px-4 fw-bold">Prisijungti</Link>
                  <Link href="/register" className="btn btn-outline-light btn-lg px-4">Registruotis</Link>
                </div>
              ) : (
                <p className="fs-4 italic">Sveiki sugrįžę, <b>{vartotojas.vardas || vartotojas.role}</b>!</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* GREITI VEIKSMAI PAGAL ROLĘ */}
      <main className="container py-5 flex-grow-1">
        <h2 className="text-center fw-bold mb-5">Greitasis meniu</h2>
        
        <div className="row g-4 justify-content-center">
          {/* Kortelė Pacientui */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-shadow transition-all">
              <div className="fs-1 mb-3">📅</div>
              <h4 className="fw-bold">Pacientams</h4>
              <p className="text-muted">Registruokitės vizitams, peržiūrėkite savo gydymo istoriją ir gaukite sąskaitas faktūras.</p>
              <Link href="/registracija" className="btn btn-outline-primary mt-auto">Registruotis vizitui</Link>
            </div>
          </div>

          {/* Kortelė Gydytojui */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-shadow transition-all">
              <div className="fs-1 mb-3">🩺</div>
              <h4 className="fw-bold">Gydytojams</h4>
              <p className="text-muted">Valdykite savo dienotvarkę, pildykite procedūrų išrašus ir užbaikite pacientų vizitus.</p>
              <Link href="/gydytojas" className="btn btn-outline-primary mt-auto">Mano darbalaukis</Link>
            </div>
          </div>

          {/* Kortelė Adminui */}
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-4 text-center hover-shadow transition-all">
              <div className="fs-1 mb-3">📊</div>
              <h4 className="fw-bold">Administracijai</h4>
              <p className="text-muted">Analizuokite klinikos pajamas, stebėkite gydytojų užimtumą ir eksportuokite ataskaitas.</p>
              <Link href="/admin/analize" className="btn btn-outline-primary mt-auto">Verslo analizė</Link>
            </div>
          </div>
        </div>
      </main>

      {/* STATISTIKOS JUOSTA (Simuliacija) */}
      <section className="bg-light py-5 border-top">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <h3 className="fw-bold text-primary">100%</h3>
              <p className="text-muted mb-0">Skaitmenizuoti išrašai</p>
            </div>
            <div className="col-md-4">
              <h3 className="fw-bold text-primary">24/7</h3>
              <p className="text-muted mb-0">Prieiga prie istorijos</p>
            </div>
            <div className="col-md-4">
              <h3 className="fw-bold text-primary">Auto</h3>
              <p className="text-muted mb-0">Sąskaitų siuntimas el. paštu</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">© 2026 OdontoPro valdymo sistema. Bakalauro darbas.</p>
        </div>
      </footer>

      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}