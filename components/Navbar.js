"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";

function Navbar() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) => {
      console.error("Failed to load bootstrap JS", err);
    });
  }, []);

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container d-flex align-items-center justify-content-between">

        {}
        <button
          className="navbar-toggler navbar-toggler-custom"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {}
        <Link className="navbar-brand mx-auto mx-lg-0 d-flex align-items-center gap-2" href="/">
          <img src="/images/Logo.jpg" alt="Company Logo" className="navbar-logo" />
        </Link>

        {}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav align-items-lg-center gap-lg-3 ms-auto">
            {}
            <li className="nav-item dropdown service-dropdown ">
              <Link 
                href="/services" 
                className="nav-link px-3 dropdown-toggle" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Paslaugos
              </Link>
              <ul className="dropdown-menu border-0 shadow-lg p-3" aria-labelledby="navbarDropdown">
                <li><Link href="/paslaugos/burnos-higiena" className="dropdown-item">Burnos higiena</Link></li>
                <li><Link href="/paslaugos/plombavimas" className="dropdown-item">Terapinis gydymas</Link></li>
                <li><Link href="/paslaugos/implantavimas" className="dropdown-item">Dantų implantavimas</Link></li>
                <li><Link href="/paslaugos/protezavimas" className="dropdown-item">Dantų protezavimas</Link></li>
                <li><Link href="/paslaugos/dantu-rovimas" className="dropdown-item">Burnos chirurgija</Link></li>
                <li><Link href="/paslaugos/kanalai" className="dropdown-item">Kanalų gydymas (Endodontija)</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link href="/paslaugos" className="dropdown-item fw-bold" style={{ color: '#5d7bb3' }}>Visos paslaugos</Link></li>
              </ul>
            </li>
            {}
            <li className="nav-item">
              <Link className="nav-link text-dark nav-link-custom" href="/kainos">Kainos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark nav-link-custom" href="/apie">Apie Mus</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark nav-link-custom" href="/#registracija">Susisiekti</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
              <a href="tel:+37065776229" className="btn btn-primary px-4 py-2 rounded-pill fw-bold cta-button text-nowrap me-2" style={{textDecoration: 'none'}}>
                +37065776229
              </a>
              <Link className="btn btn-primary px-4 py-2 rounded-pill fw-bold cta-button text-nowrap" href="/prisijungti">Registracija</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
