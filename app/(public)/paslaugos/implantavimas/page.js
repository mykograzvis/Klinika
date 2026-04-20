"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../services.css";

export default function DantuImplantavimas() {
  return (
    <div className="page container py-5">
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
          <h1 className="burnos-title mb-3">Dantų implantavimas</h1>
          <p className="lead">
            Sugrąžinkite pilnavertį gyvenimą, pasitikėjimą savimi ir sveiką šypseną.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="row align-items-center justify-content-center py-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <Image
            src="/images/services/implantai/implantai5.jpg"
            alt="Dantų implantas ir jo struktūra"
            width={500}
            height={350}
            className="burnos-image img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-6">
          <div className="burnos-text p-4 shadow-sm rounded">
            <h4>Kodėl verta rinktis dantų implantus?</h4>
            <p>
              Dantų implantavimas yra pats pažangiausias būdas atkurti prarastus dantis. 
              Implantas atstoja danties šaknį, todėl ne tik atrodo natūraliai, bet ir 
              neleidžia nykti žandikaulio kaului bei apsaugo gretimus dantis nuo šlifavimo.
            </p>
            <p>
              Mūsų klinikoje naudojami tik aukščiausios kokybės, visame pasaulyje pripažinti 
              **titano implantai**.
            </p>

            <h5 className="mt-4">Implantacijos privalumai:</h5>
            <ul>
              <li>Atkuriamas 100% kramtymo efektyvumas</li>
              <li>Nereikia šlifuoti ar kitaip pažeisti gretimų sveikų dantų</li>
              <li>Ilgaamžiškumas – tinkamai prižiūrint, implantai tarnauja visą gyvenimą</li>
              <li>Nepriekaištinga estetika, nesiskirianti nuo tikrų dantų</li>
            </ul>
          </div>
        </div>
      </motion.div>

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
              <h5>Konsultacija ir planas</h5>
              <p>Gydymo plano sudarymas</p>
              <span className="price-tag">Nemokamai</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Danties implantas</h5>
              <p>Sraigto įsriegimas (chirurginis etapas)</p>
              <span className="price-tag">nuo €550</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Protezavimas ant implanto</h5>
              <p>Cirkonio keramikos vainikėlis ir atrama</p>
              <span className="price-tag">nuo €450</span>
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