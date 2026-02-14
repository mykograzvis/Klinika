"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaCheckCircle, FaInfoCircle, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = (formData) => {
    const errors = {};
    
    // Vardas validacija
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Įveskite vardą ir pavardę";
    }

    // Telefono validacija
    const phoneRegex = /^[\d\s+()-]{6,}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      errors.phone = "Įveskite galiojantį telefono numerį";
    }

    // El. pašto validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Įveskite galiojantį el. pašto adresą";
    }

    // Paslaugos validacija
    if (!formData.service) {
      errors.service = "Pasirinkite paslaugą";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      service: e.target.service.value,
      message: e.target.message.value,
    };

    // Validuoti formą
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        // Išvalyti formą
        e.target.reset();
      } else {
        setError('Nepavyko išsiųsti užklausos. Bandykite dar kartą arba susisiekite telefonu.');
      }
    } catch (err) {
      setError('Įvyko klaida. Patikrinkite interneto ryšį ir bandykite dar kartą.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
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
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Vardas Pavardė *</label>
                      <input 
                        type="text" 
                        name="name"
                        className={`form-control bg-light border-0 py-3 ${fieldErrors.name ? 'is-invalid' : ''}`}
                        placeholder="Vardas Pavardė" 
                        disabled={loading}
                      />
                      {fieldErrors.name && (
                        <div className="invalid-feedback d-flex align-items-center mt-2">
                          <FaExclamationTriangle className="me-2" />
                          {fieldErrors.name}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Telefono numeris *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        className={`form-control bg-light border-0 py-3 ${fieldErrors.phone ? 'is-invalid' : ''}`}
                        placeholder="+370 6..." 
                        disabled={loading}
                      />
                      {fieldErrors.phone && (
                        <div className="invalid-feedback d-flex align-items-center mt-2">
                          <FaExclamationTriangle className="me-2" />
                          {fieldErrors.phone}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">El. pašto adresas *</label>
                      <input 
                        type="email" 
                        name="email"
                        className={`form-control bg-light border-0 py-3 ${fieldErrors.email ? 'is-invalid' : ''}`}
                        placeholder="el.pastas@pavyzdys.lt" 
                        disabled={loading}
                      />
                      {fieldErrors.email && (
                        <div className="invalid-feedback d-flex align-items-center mt-2">
                          <FaExclamationTriangle className="me-2" />
                          {fieldErrors.email}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Paslauga *</label>
                      <select 
                        name="service"
                        className={`form-select bg-light border-0 py-3 ${fieldErrors.service ? 'is-invalid' : ''}`}
                        defaultValue=""
                        disabled={loading}
                      >
                        <option value="" disabled>Pasirinkite paslaugą...</option>
                        <option value="Gydytojo apžiūra / Konsultacija">Gydytojo apžiūra / Konsultacija</option>
                        <option value="Burnos higiena">Burnos higiena</option>
                        <option value="Dantų gydymas (plombavimas)">Dantų gydymas (plombavimas)</option>
                        <option value="Implantavimas / Chirurgija">Implantavimas / Chirurgija</option>
                        <option value="Protezavimas">Protezavimas</option>
                        <option value="Kita / Nežinau (reikia patarimo)">Kita / Nežinau (reikia patarimo)</option>
                      </select>
                      {fieldErrors.service && (
                        <div className="invalid-feedback d-flex align-items-center mt-2">
                          <FaExclamationTriangle className="me-2" />
                          {fieldErrors.service}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Žinutė</label>
                      <textarea 
                        name="message"
                        className="form-control bg-light border-0 py-3" 
                        rows="3" 
                        placeholder="Parašykite papildomą informaciją..."
                        disabled={loading}
                      ></textarea>
                    </div>
                    
                    {error && (
                      <div className="col-12">
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="alert alert-danger d-flex align-items-center border-0 shadow-sm" 
                          role="alert"
                          style={{ 
                            backgroundColor: '#f8d7da',
                            borderRadius: '12px',
                            padding: '1rem'
                          }}
                        >
                          <FaExclamationTriangle className="me-3" size={24} style={{ color: '#842029' }} />
                          <div>
                            <strong>Klaida!</strong> {error}
                          </div>
                        </motion.div>
                      </div>
                    )}

                    <div className="col-12 mt-2">
                      <div className="d-flex align-items-center text-muted small">
                        <FaInfoCircle className="me-2" style={{ color: "#5d7bb3" }} />
                        <span>Po formos išsiuntimo, su Jumis susisieksime nurodytais kontaktais.</span>
                      </div>
                    </div>

                    <div className="col-12 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm transition-all" 
                        style={{ backgroundColor: "#5d7bb3", border: "none" }}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="me-2 spinner-border spinner-border-sm" />
                            Siunčiama...
                          </>
                        ) : (
                          'Registruotis vizitui'
                        )}
                      </button>
                      <p className="text-center text-muted small mt-3">* Privalomi laukai</p>
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
