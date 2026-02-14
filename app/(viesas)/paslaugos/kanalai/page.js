"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../services.css";

export default function KanaluGydymas() {
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
          <h1 className="burnos-title mb-3">Endodontinis kanalų gydymas</h1>
          <p className="lead">
            Tikslumas ir kruopštumas siekiant išsaugoti Jūsų natūralius dantis.
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
            src="/images/services/root canal/kanalai.jpg" // Pakeiskite į savo turimą paveikslėlį
            alt="Endodontinis kanalų gydymas mikroskopu"
            width={500}
            height={350}
            className="burnos-image img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-6">
          <div className="burnos-text p-4 shadow-sm rounded">
            <h4>Kada reikalingas kanalų gydymas?</h4>
            <p>
              Endodontinis gydymas taikomas, kai danties minkštieji audiniai (pulpa) 
              pažeidžiami uždegimo ar infekcijos. Tai dažniausiai sukelia gilūs karieso 
              pažeidimai, dantų skilimai ar traumos.
            </p>

            <h5 className="mt-4">Simptomai, rodantys problemą:</h5>
            <ul>
              <li>Spontaniškas, stiprus danties skausmas (ypač naktį)</li>
              <li>Ilgai trunkantis jautrumas karštam maistui ar gėrimams</li>
              <li>Danties spalvos patamsėjimas</li>
              <li>Dantenų tinimas ar pūlinukas šalia skaudamo danties</li>
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
              <h5>1-o kanalo gydymas</h5>
              <p>Pirminis kanalo išvalymas, paruošimas ir užpildymas</p>
              <span className="price-tag">nuo €50</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>2-3 kanalų gydymas</h5>
              <p>Krūminių dantų kanalų kompleksinis gydymas</p>
              <span className="price-tag">nuo €150</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Kanalų pergydymas</h5>
              <p>Senų užpildų šalinimas ir pakartotinis gydymas</p>
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