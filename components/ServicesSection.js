"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15 } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const services = [
  { slug: "burnos-higiena", img: "/images/services/hygiene.png", title: "Burnos higiena", text: "Profesionalus dantų akmenų ir apnašų šalinimas bei profilaktinė priežiūra." },
  { slug: "plombavimas", img: "/images/services/filling.png", title: "Terapinis gydymas", text: "Estetinis ir funkcionalus dantų atkūrimas moderniomis plombavimo medžiagomis." },
  { slug: "kanalai", img: "/images/services/root-canal.png", title: "Kanalų gydymas", text: "Šaknų kanalų gydymas pažangia įranga, siekiant išsaugoti natūralius dantis." },
  { slug: "dantu-rovimas", img: "/images/services/extraction.png", title: "Burnos chirurgija", text: "Neskausmingas ir saugus dantų šalinimas su profesionalia priežiūra po procedūros." },
  { slug: "implantavimas", img: "/images/services/implant.png", title: "Dantų implantai", text: "Ilgalaikiai sprendimai prarastiems dantims atkurti naudojant aukštos kokybės implantus." },
  { slug: "protezavimas", img: "/images/services/prosthetics.png", title: "Protezavimas", text: "Dantų protezavimas estetiniais vainikėliais, užtikrinant natūralią šypseną ir komfortą." },
];

export default function ServicesSection() {
  return (
    <motion.div
      className="container mb-5 services-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-center mb-5 service-heading">
        <span className="line"></span>
        Mūsų Paslaugos
        <span className="line"></span>
      </h2>

      <div className="row g-4 mb-5">
        {services.map((service, i) => (
          <motion.div key={i} className="col-md-4 text-center" variants={cardVariants}>
            <Link href={`/paslaugos/${service.slug}`} className="text-decoration-none" prefetch={false}>
              <div className="card shadow-sm p-4 h-100 service-card border-0">
                <img src={service.img} alt={service.title} className="service-icon mb-3" />
                <h5 className="service-card-title">{service.title}</h5>
                <p className="service-card-text">{service.text}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link 
          href="/paslaugos" 
          className="btn btn-lg px-5 rounded-pill shadow-sm all-services-btn"
          prefetch={false}
          style={{ 
            backgroundColor: "#5d7bb3", 
            color: "white", 
            fontSize: "1.1rem", 
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
        >
          Žiūrėti visas paslaugas
        </Link>
      </motion.div>
    </motion.div>
  );
}