// Navbar.jsx
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";

function Navbar() {
  // Load bootstrap JS on client to make collapse toggler work
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) => {
      // swallow errors but log for debugging
      console.error("Failed to load bootstrap JS", err);
    });
  }, []);

  return (
    <nav className="custom-navbar navbar navbar-expand-lg navbar-light bg-white py-3">
      <div className="container d-flex align-items-center justify-content-between">

        {/* Left: Burger button */}
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

        {/* Center: Logo (always centered on mobile, left on desktop) */}
        <Link className="navbar-brand mx-auto mx-lg-0 d-flex align-items-center gap-2" href="/" prefetch={false}>
          <img src="/images/Logo.jpg" alt="Company Logo" className="navbar-logo" />
        </Link>

        {/* Right: Nav links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav align-items-lg-center gap-lg-3 ms-auto">
            {/* DROP DOWN MENIU PRADŽIA */}
            <li className="nav-item dropdown service-dropdown ">
              <Link 
                href="/services" 
                prefetch={false}
                className="nav-link px-3 dropdown-toggle" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Paslaugos
              </Link>
              <ul className="dropdown-menu border-0 shadow-lg p-3" aria-labelledby="navbarDropdown">
                <li><Link href="/paslaugos/burnos-higiena" className="dropdown-item" prefetch={false}>Burnos higiena</Link></li>
                <li><Link href="/paslaugos/plombavimas" className="dropdown-item" prefetch={false}>Terapinis gydymas</Link></li>
                <li><Link href="/paslaugos/implantavimas" className="dropdown-item" prefetch={false}>Dantų implantavimas</Link></li>
                <li><Link href="/paslaugos/protezavimas" className="dropdown-item" prefetch={false}>Dantų protezavimas</Link></li>
                <li><Link href="/paslaugos/dantu-rovimas" className="dropdown-item" prefetch={false}>Burnos chirurgija</Link></li>
                <li><Link href="/paslaugos/kanalai" className="dropdown-item" prefetch={false}>Kanalų gydymas (Endodontija)</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link href="/paslaugos" className="dropdown-item fw-bold" style={{ color: '#5d7bb3' }} prefetch={false}>Visos paslaugos</Link></li>
              </ul>
            </li>
            {/* DROP DOWN MENIU PABAIGA */}
            <li className="nav-item">
              <Link className="nav-link text-dark nav-link-custom" href="/kainos" prefetch={false}>Kainos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark nav-link-custom" href="/apie" prefetch={false}>Apie Mus</Link>
            </li>
            <li className="nav-item d-flex align-items-center">
              <a href="tel:+37065776229" className="btn btn-primary px-4 py-2 rounded-pill fw-bold cta-button text-nowrap me-2" style={{textDecoration: 'none'}}>
                +37065776229
              </a>
              <Link className="btn btn-primary px-4 py-2 rounded-pill fw-bold cta-button text-nowrap" href="/#registracija" prefetch={false}>Susisiekti</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
