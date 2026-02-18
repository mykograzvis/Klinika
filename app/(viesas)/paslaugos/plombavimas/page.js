"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../services.css";

export default function Plombavimas() {
  return (
    <div className="page container py-5">
      {/* Hero sekcija su fono paveikslėliu */}
      <motion.div
        className="burnos-hero text-center text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: 'url(/images/services/bg.jpg)', // Galite pasikeisti į specifinį plombavimo foną
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "15px",
          minHeight: "300px"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div>
          <h1 className="burnos-title mb-3">Terapinis ir estetinis plombavimas</h1>
          <p className="lead">
            Atkuriame dantų formą, funkciją ir natūralią estetiką.
          </p>
        </div>
      </motion.div>

      {/* Turinys */}
      <motion.div
        className="row align-items-center justify-content-center py-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <Image
            src="/images/services/plombavimas.jpg" // Įsitikinkite, kad turite šį failą arba pakeiskite pavadinimą
            alt="Dantų plombavimo procedūra"
            width={500}
            height={350}
            className="burnos-image img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-6">
          <div className="burnos-text p-4 shadow-sm rounded">
            <h4>Kodėl svarbus savalaikis plombavimas?</h4>
            <p>
              Dantų plombavimas (terapinis gydymas) yra būtinas norint sustabdyti karieso plitimą 
              ir išsaugoti dantis gyvybingus. Pašalinus pažeistus audinius, dantis hermetiškai 
              užpildomas aukščiausios kokybės helio plombomis, kurios idealiai prisitaiko prie spalvos.
            </p>
            <p>
              Mūsų klinikoje naudojamos modernios nanohibridinės kompozitinės medžiagos, 
              kurios pasižymi ypatingu tvirtumu ir natūraliu blizgesiu. Procedūros metu 
              užtikriname maksimalų komfortą ir neskausmingą nuskausminimą.
            </p>

            <h5 className="mt-4">Kada kreiptis į gydytoją?</h5>
            <ul>
              <li>Pastebėjus tamsias dėmes ant dantų paviršiaus</li>
              <li>Jaučiant jautrumą šalčiui, karščiui ar saldumynams</li>
              <li>Nuskilus danties kraštui ar iškritus senai plombai</li>
              <li>Norint pakeisti senas, patamsėjusias ar nehermetiškas plombas</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Kainų sekcija */}
      <motion.div
        className="burnos-prices text-center mt-5 p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h3 className="mb-4">Orientacinės kainos</h3>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Paviršinis plombavimas</h5>
              <p>Nedidelio karieso gydymas, minimalus defektas</p>
              <span className="price-tag">nuo €60</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Vidutinio dydžio plomba</h5>
              <p>Dviejų ar daugiau danties paviršių atkūrimas</p>
              <span className="price-tag">nuo €85</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Estetinis plombavimas</h5>
              <p>Priekinių dantų formos ir spalvos korekcija</p>
              <span className="price-tag">nuo €120</span>
            </div>
          </div>
        </div>

        <Link
          href="/kainos"
          className="btn btn-outline-primary mt-4 px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
          prefetch={false}
          style={{
            borderRadius: "2rem",
            fontSize: "1.1rem",
            letterSpacing: "0.5px",
          }}
        >
          Visas kainoraštis <FaArrowRight style={{ fontSize: "1.1em", marginLeft: "0.3em" }} />
        </Link>
      </motion.div>
    </div>
  );
}