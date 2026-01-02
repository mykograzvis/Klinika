// pages/index.js
import React from "react";
import { motion } from "framer-motion";
import DoctorsCarousel from "../components/DoctorsCarousel";
import ScrollToTopButton from "../components/ScrollToTopButton";
import Hero from "../components/Hero";
import "../styles/Home.css"; // adjust if your CSS is elsewhere

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <Hero />

      <motion.div
        className="container mb-5 services-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <h2 className="text-center mb-5 service-heading">
          <span className="line"></span>
          Mūsų Paslaugos
          <span className="line"></span>
        </h2>

        {/* First row */}
        <div className="row g-4 mb-4">
          <motion.div className="col-md-4 text-center" variants={cardVariants}>
            <div className="card shadow-sm p-4 h-100 service-card">
              <img
                src="/images/services/hygiene.png"
                alt="Burnos higiena"
                className="service-icon mb-3"
              />
              <h5 className="service-card-title">Burnos higiena</h5>
              <p className="service-card-text">
                Profesionalus dantų akmenų ir apnašų šalinimas bei profilaktinė priežiūra.
              </p>
            </div>
          </motion.div>

          <motion.div className="col-md-4 text-center" variants={cardVariants}>
            <div className="card shadow-sm p-4 h-100 service-card">
              <img
                src="/images/services/filling.png"
                alt="Plombavimas"
                className="service-icon mb-3"
              />
              <h5 className="service-card-title">Plombavimas</h5>
              <p className="service-card-text">
                Estetinis ir funkcionalus dantų atkūrimas moderniomis plombavimo medžiagomis.
              </p>
            </div>
          </motion.div>

          <motion.div className="col-md-4 text-center" variants={cardVariants}>
            <div className="card shadow-sm p-4 h-100 service-card">
              <img
                src="/images/services/root-canal.png"
                alt="Kanalų gydymas"
                className="service-icon mb-3"
              />
              <h5 className="service-card-title">Kanalų gydymas</h5>
              <p className="service-card-text">
                Šaknų kanalų gydymas pažangia įranga, siekiant išsaugoti natūralius dantis.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Second row */}
        <div className="row g-4">
          <motion.div className="col-md-4 text-center" variants={cardVariants}>
            <div className="card shadow-sm p-4 h-100 service-card">
              <img
                src="/images/services/extraction.png"
                alt="Dantų rovimas"
                className="service-icon mb-3"
              />
              <h5 className="service-card-title">Dantų rovimas</h5>
              <p className="service-card-text">
                Neskausmingas ir saugus dantų šalinimas su profesionalia priežiūra po procedūros.
              </p>
            </div>
          </motion.div>

          <motion.div className="col-md-4 text-center" variants={cardVariants}>
            <div className="card shadow-sm p-4 h-100 service-card">
              <img
                src="/images/services/implant.png"
                alt="Implantavimas"
                className="service-icon mb-3"
              />
              <h5 className="service-card-title">Implantavimas</h5>
              <p className="service-card-text">
                Ilgalaikiai sprendimai prarastiems dantims atkurti naudojant aukštos kokybės implantus.
              </p>
            </div>
          </motion.div>

          <motion.div className="col-md-4 text-center" variants={cardVariants}>
            <div className="card shadow-sm p-4 h-100 service-card">
              <img
                src="/images/services/prosthetics.png"
                alt="Protezavimas"
                className="service-icon mb-3"
              />
              <h5 className="service-card-title">Protezavimas</h5>
              <p className="service-card-text">
                Dantų protezavimas estetiniais vainikėliais, užtikrinant natūralią šypseną ir komfortą.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mb-5">
        <DoctorsCarousel />
      </div>

      <ScrollToTopButton />
    </>
  );
}
