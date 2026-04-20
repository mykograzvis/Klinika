"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../services.css";

export default function BurnosHigiena() {
  return (
    <div className="page container py-5">
      <motion.div
        className="burnos-hero text-center text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: 'url(/images/services/bg.jpg)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div>
          <h1 className="burnos-title mb-3">Profesionali burnos higiena</h1>
          <p className="lead">
            Švarūs dantys – sveikos dantenos ir graži šypsena kiekvieną dieną.
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        className="row align-items-center justify-content-center py-5"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <Image
            src="/images/services/oralHygiene4.png"
            alt="Burnos higiena procedūra"
            width={500}
            height={350}
            className="burnos-image img-fluid rounded shadow-sm"
          />
        </div>

        <div className="col-md-6">
          <div className="burnos-text p-4 shadow-sm rounded">
            <h4>Kodėl reikalinga profesionali burnos higiena?</h4>
            <p>
              Burnos higienos metu pašalinamos apnašos ir akmenys, kurie
              susidaro net ir reguliariai valant dantis. Tai padeda išvengti
              dantenų ligų, nemalonaus burnos kvapo bei dantų karieso.
            </p>
            <p>
              Mūsų klinikoje procedūra atliekama naudojant modernią ultragarsinę
              įrangą ir švelnias priemones, todėl ji yra visiškai neskausminga
              ir saugi.
            </p>

            <h5 className="mt-4">Kada rekomenduojama atlikti?</h5>
            <ul>
              <li>Kas 6 mėnesius profilaktiškai</li>
              <li>Po ortodontinio ar implantavimo gydymo</li>
              <li>Jei jaučiamas dantenų kraujavimas ar jautrumas</li>
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
        <h3 className="mb-4">Kainos</h3>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Standartinė higiena</h5>
              <p>Visos burnos valymas ultragarsu ir poliravimas</p>
              <span className="price-tag">€60</span>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="price-card shadow-sm p-4 rounded">
              <h5>Giluminė higiena</h5>
              <p>Pažengusios apnašos, dantenų giluminis valymas</p>
              <span className="price-tag">€80</span>
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
