"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Čia būtų siuntimo logika į jūsų serverį
    setSubmitted(true);
  };

  return (
    <section id="registracija" className="contact-section py-5 mb-5">
      <div className="container">
        <div className="row g-5">
          
          {/* Kairė pusė: Kontaktai ir Darbo laikas */}
          <motion.div 
            className="col-lg-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="service-heading-clean text-start mb-4">Susisiekite</h2>
            <p className="text-muted mb-5">
              Užpildykite užklausos formą ir mūsų administracija su Jumis susisieks artimiausiu metu suderinti vizito laiko.
            </p>

            <div className="contact-info-list">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle me-3"><FaPhoneAlt /></div>
                <div>
                  <h6 className="mb-0 fw-bold">Telefonas</h6>
                  <a href="tel:+37068793063" className="text-muted text-decoration-none">+37068793063</a>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle me-3"><FaEnvelope /></div>
                <div>
                  <h6 className="mb-0 fw-bold">El. paštas</h6>
                  <a href="mailto:gelmidenta@gmail.com" className="text-muted text-decoration-none">gelmidenta@gmail.com</a>
                </div>
              </div>

              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle me-3"><FaMapMarkerAlt /></div>
                <div>
                  <h6 className="mb-0 fw-bold">Adresas</h6>
                  <a 
                href="https://www.google.com/maps?q=Nemuno+g.+11,+Panevėžys,+36236+Panevėžio+m.+sav." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-black text-decoration-none"
              >
                Nemuno g. 11, Panevėžys, 36236 Panevėžio m. sav.
              </a>
                  
                </div>
              </div>

              {/* Sugrąžintas Darbo Laikas */}
              <div className="d-flex align-items-center mb-4">
                <div className="icon-circle me-3"><FaClock /></div>
                <div>
                  <h6 className="mb-0 fw-bold">Darbo laikas</h6>
                  <span className="text-muted">I-V: 08:00 - 20:00</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dešinė pusė: Registracijos forma */}
          <motion.div className="col-lg-7">
            <div className="registration-form-card p-4 p-md-5 shadow-sm bg-white rounded-4 border-0">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-5"
                >
                  <FaCheckCircle size={60} color="#5d7bb3" className="mb-4" />
                  <h3 className="fw-bold">Užklausa išsiųsta!</h3>
                  <p className="text-muted">Ačiū, gavome Jūsų duomenis. Su Jumis susisieksime artimiausiu metu.</p>
                  <button className="btn btn-outline-primary mt-3 rounded-pill px-4" onClick={() => setSubmitted(false)}>
                    Siųsti kitą užklausą
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Vardas Pavardė *</label>
                      <input type="text" className="form-control bg-light border-0 py-3" placeholder="Vardas Pavardė" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Telefono numeris *</label>
                      <input type="tel" className="form-control bg-light border-0 py-3" placeholder="+370 6..." required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">El. pašto adresas *</label>
                      <input type="email" className="form-control bg-light border-0 py-3" placeholder="el.pastas@pavyzdys.lt" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Paslauga *</label>
                      <select className="form-select bg-light border-0 py-3" required defaultValue="">
                        <option value="" disabled>Pasirinkite paslaugą...</option>
                        <option value="konsultacija">Gydytojo apžiūra / Konsultacija</option>
                        <option value="higiena">Burnos higiena</option>
                        <option value="gydymas">Dantų gydymas (plombavimas)</option>
                        <option value="implantacija">Implantavimas / Chirurgija</option>
                        <option value="protezavimas">Protezavimas</option>
                        <option value="kita">Kita / Nežinau (reikia patarimo)</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Žinutė</label>
                      <textarea className="form-control bg-light border-0 py-3" rows="3" placeholder="Parašykite papildomą informaciją..."></textarea>
                    </div>
                    
                    {/* Informacinis pranešimas po forma */}
                    <div className="col-12 mt-2">
                      <div className="d-flex align-items-center text-muted small">
                        <FaInfoCircle className="me-2" style={{ color: "#5d7bb3" }} />
                        <span>Po formos išsiuntimo, su Jumis susisieksime nurodytais kontaktais.</span>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm transition-all" style={{ backgroundColor: "#5d7bb3", border: "none" }}>
                        Registruotis vizitui
                      </button>
                      <p className="text-center text-muted small mt-3">* Užpildykite visus privalomus laukus</p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}