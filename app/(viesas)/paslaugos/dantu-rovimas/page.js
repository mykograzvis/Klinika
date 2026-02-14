"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../services.css";

export default function DantuRovimas() {
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
          <h1 className="burnos-title mb-3">Saugus ir neskausmingas dantų rovimas</h1>
          <p className="lead">
            Mūsų prioritetas – Jūsų komfortas net ir sudėtingiausių procedūrų metu.
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
            src="/images/services/rovimas/rovimas2.jpg" // Pakeiskite į savo turimą failą
            alt="Dantų rovimo procedūra"
            width={500}
            height={350}
            className="burnos-image img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-6">
          <div className="burnos-text p-4 shadow-sm rounded">
            <h4>Kada danties rovimas yra būtinas?</h4>
            <p>
              Nors šiuolaikinė odontologija siekia išsaugoti kiekvieną natūralų dantį, 
              tam tikrais atvejais rovimas yra neišvengiamas siekiant sustabdyti infekciją 
              ar apsaugoti gretimus dantis.
            </p>
            <p>
              Procedūras atliekame naudodami stiprius vietinius anestetikus, todėl 
              **skausmo nejausite**. Po procedūros pateikiame išsamias rekomendacijas, 
              kaip greitai ir sklandžiai pasveikti, bei aptariame tolimesnes danties 
              atkūrimo galimybes (implantaciją ar protezavimą).
            </p>

            <h5 className="mt-4">Dažniausios rovimo priežastys:</h5>
            <ul>
              <li>Stipriai sugedęs dantis, kurio neįmanoma sugydyti</li>
              <li>Problemiški, netaisyklingai dygstantys protiniai dantys</li>
              <li>Dantų lūžiai ar gilūs šaknų skilimai</li>
              <li>Rovimas dėl ortodontinio gydymo (vietos trūkumas)</li>
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
              <h5>Paprastas rovimas</h5>
              <p>Vieno vienšaknio danties šalinimas su vietine nejautra</p>
              <span className="price-tag">nuo €40</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Sudėtingas rovimas</h5>
              <p>Daugiašaknio ar stipriai suirusio danties šalinimas</p>
              <span className="price-tag">nuo €80</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Protinio danties rovimas</h5>
              <p>Operacinis protinio ar retinuoto (neišdygusio) danties šalinimas</p>
              <span className="price-tag">nuo €120</span>
            </div>
          </div>
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