"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import "./services.css";

const allServices = [
  {
    id: "burnos-higiena",
    title: "Burnos higiena",
    description: "Profesionalus akmenų šalinimas, pigmentinių apnašų valymas Air-flow metodu.",
    icon: "/images/services/hygiene.png"
  },
  {
    id: "plombavimas",
    title: "Terapinis gydymas",
    description: "Karieso gydymas, estetiškas plombavimas ir dantų formos atkūrimas.",
    icon: "/images/services/filling.png"
  },
  {
    id: "implantavimas",
    title: "Dantų implantavimas",
    description: "Prarastų dantų atkūrimas naudojant aukščiausios kokybės šveicariškus implantus.",
    icon: "/images/services/implant.png"
  },
  {
    id: "protezavimas",
    title: "Dantų protezavimas",
    description: "Vainikėliai, tiltai ir protezai. Atliekame protezavimą kompensuojamą PSDF lėšomis.",
    icon: "/images/services/prosthetics.png"
  },
  {
    id: "dantu-rovimas",
    title: "Burnos chirurgija",
    description: "Protinių dantų rovimas ir kitos chirurginės intervencijos be skausmo.",
    icon: "/images/services/extraction.png"
  },
  {
    id: "kanalai",
    title: "Endodontija",
    description: "Šaknų kanalų gydymas ir pergydymas naudojant modernų mikroskopą.",
    icon: "/images/services/root-canal.png"
  }
];

export default function PaslaugosPage() {
  return (
    <div className="paslaugos-page">
      {/* Hero dalis */}
      <section className="paslaugos-hero text-center py-5">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="service-heading-clean"
          >
            Mūsų teikiamos paslaugos
          </motion.h1>
          <div className="heading-underline mb-4"></div>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
            Teikiame visas odontologijos paslaugas – nuo profilaktinės higienos iki sudėtingų implantacijos operacijų. Mūsų tikslas – Jūsų sveika ir spindinti šypsena.
          </p>
        </div>
      </section>

      {/* Paslaugų tinklelis */}
      <section className="container py-5">
        <div className="row g-4">
          {allServices.map((service, index) => (
            <motion.div 
              key={service.id}
              className="col-lg-4 col-md-6"
              // PAKEITIMAS ČIA: Naudojame animate vietoj whileInView, 
              // kad kortelės užsitikrintų krovimąsi iškart
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, // Kortelės atsiranda viena po kitos
                ease: "easeOut" 
              }}
            >
              <div className="service-page-card shadow-sm h-100">
                <div className="p-5 text-center d-flex flex-column h-100">
                  <div className="icon-box mb-4 mx-auto">
                    <img src={service.icon} alt={service.title} />
                  </div>
                  <h3 className="mb-3 h4 fw-bold text-dark">{service.title}</h3>
                  <p className="text-muted mb-4 flex-grow-1">{service.description}</p>
                  
                  <Link href={`/paslaugos/${service.id}`} className="read-more-btn mt-auto">
                    Plačiau apie paslaugą <FaArrowRight className="ms-2" size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PSDF Info Blokas */}
      <section className="container mb-5 mt-4">
        <div className="psdf-banner p-4 rounded-4 d-flex align-items-center justify-content-between text-white" style={{ backgroundColor: "#5d7bb3" }}>
          <div className="p-3">
            <h4 className="fw-bold">Protezavimas PSDF lėšomis</h4>
            <p className="mb-0 opacity-90">Senjorams, vaikams ir neįgaliesiems paslaugos gali būti kompensuojamos iš ligonių kasų.</p>
          </div>
          <Link href="https://ligoniukasa.lrv.lt/lt/veiklos-sritys/informacija-gyventojams/gydymo-ir-sveikatos-prieziuros-paslaugos/odontologines-paslaugos/dantu-protezavimas/" className="btn btn-outline-light rounded-pill px-4 me-3" target="_blank" rel="noopener noreferrer">
            Sužinoti daugiau
          </Link>
        </div>
      </section>
    </div>
  );
}