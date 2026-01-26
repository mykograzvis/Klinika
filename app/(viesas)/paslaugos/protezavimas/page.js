"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../services.css";

export default function DantuProtezavimas() {
  return (
    <div className="page container py-5">
      {/* Hero sekcija */}
      <motion.div
        className="burnos-hero text-center text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: 'url(/images/services/bg.jpg)', 
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
          <h1 className="burnos-title mb-3">Dantų protezavimas</h1>
          <p className="lead">
            Atkurkite tvirtą, funkcionalią ir natūraliai atrodančią šypseną.
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
            src="/images/services/protezavimas/protezavimas2.jpg" // Pakeiskite į savo turimą failą
            alt="Dantų vainikėliai ir protezai"
            width={500}
            height={350}
            className="burnos-image img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-6">
          <div className="burnos-text p-4 shadow-sm rounded">
            <h4>Kada reikalingas dantų protezavimas?</h4>
            <p>
              Protezavimas taikomas tuomet, kai dantis yra stipriai pažeistas karieso, 
              nuskilęs, nudilęs arba kai jo visiškai trūksta. Tai ne tik estetinė 
              procedūra – ji būtina norint atkurti taisyklingą kramtymą ir apsaugoti 
              likusius dantis nuo per didelio krūvio.
            </p>
            <p>
              Mes naudojame aukščiausios kokybės **cirkonio keramikos** ir **bemetalės 
              keramikos** konstrukcijas. Jos pasižymi ne tik ypatingu tvirtumu, bet ir 
              skaidrumu, todėl protezuoti dantys atrodo visiškai natūraliai, lyg tikri.
            </p>

            <h5 className="mt-4">Protezavimo galimybės:</h5>
            <ul>
              <li>Dantų vainikėliai (karūnėlės) stipriai pažeistiems dantims</li>
              <li>Dantų tilteliai trūkstamiems dantims užpildyti</li>
              <li>Laminatės – tobulai priekinių dantų estetikai</li>
              <li>Išimami protezai arba protezavimas ant implantų</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Iškelta PSDF informacija */}
      <motion.div
        className="burnos-text psdf-info p-4 shadow-sm rounded"
      >
        <h4>Informacija dėl PSDF kompensacijos</h4>
        <p className="mb-2">
          Mūsų klinika yra sudariusi sutartį su <strong>Teritorinėmis ligonių kasomis (TLK)</strong>. 
          Dantų protezavimo paslaugos kompensuojamos iš PSDF biudžeto šioms asmenų grupėms:
        </p>
        <ul className="row list-unstyled ms-1">
          <li className="col-md-6">Pensinio amžiaus asmenims</li>
          <li className="col-md-6">Vaikams iki 18 metų</li>
          <li className="col-md-6">Neįgaliesiems asmenims</li>
          <li className="col-md-6">Onkologiniams ligoniams</li>
        </ul>
        <p className="small mt-2 text-muted italic">
          * Dokumentų tvarkymu pasirūpinsime mes – Jums tereikia atvykti konsultacijai.
        </p>
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
              <h5>Bemetalė keramika</h5>
              <p>E.max vainikėlis – aukščiausia estetika priekiniams dantims</p>
              <span className="price-tag">nuo €350</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Cirkonio keramika</h5>
              <p>Ypač tvirtas ir estetiškas vainikėlis krūminiams dantims</p>
              <span className="price-tag">nuo €300</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Išimamas protezas</h5>
              <p>Pilna arba dalinė plokštelė prarastiems dantims atkurti</p>
              <span className="price-tag">nuo €250</span>
            </div>
          </div>
          <p className="text-muted small">
            <em>Galutinė kaina priklauso nuo Jums skiriamos TLK kompensacijos dydžio.</em>
          </p>
        </div>

        <Link
          href="/kainos"
          className="btn btn-outline-primary mt-4 px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
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