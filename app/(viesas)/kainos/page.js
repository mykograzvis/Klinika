"use client";

import React from "react";
import { motion } from "framer-motion";
//import "./kainos.css";

const priceCategories = [
  {
    category: "Profilaktika ir higiena",
    items: [
      { name: "Profesionali burnos higiena (suaugusiems)", price: "60 - 80 €" },
      { name: "Burnos higiena vaikams", price: "30 - 45 €" },
      { name: "Gydytojo odontologo konsultacija ir apžiūra", price: "20 - 30 €" },
      { name: "Pakartotinė konsultacija gydymo metu", price: "0 - 15 €" },
      { name: "Fluoro aplikacija (vienas dantis)", price: "20 €" },
    ],
  },
  {
    category: "Diagnostika",
    items: [
      { name: "Skaitmeninė danties rentgeno nuotrauka", price: "10 €" },
      { name: "Gydymo plano sudarymas", price: "20 - 40 €" },
    ],
  },
  {
    category: "Terapinis gydymas",
    items: [
      { name: "Estetinis plombavimas (priekinis dantis)", price: "100 - 180 €" },
      { name: "Šviesoje kietėjanti plomba (maža/vidutinė/didelė)", price: "60 - 150 €" },
      { name: "Paviršinio karieso gydymas (be gręžimo)", price: "40 €" },
      { name: "Danties jautrumo gydymas (vienas dantis)", price: "15 €" },
    ],
  },
  {
    category: "Endodontija (Kanalų gydymas)",
    items: [
      { name: "Vieno kanalo paruošimas ir pildymas", price: "100 - 120 €" },
      { name: "Dviejų kanalų paruošimas ir pildymas", price: "200 - 210 €" },
      { name: "Trijų-keturių kanalų paruošimas ir pildymas", price: "300 - 320 €" },
      { name: "Seno užpildo išėmimas iš kanalo", price: "30 - 50 €" },
    ],
  },
  {
    category: "Chirurgija",
    items: [
      { name: "Paprastas danties rovimas", price: "40 - 80 €" },
      { name: "Sudėtingas (operacinis) rovimas", price: "120 - 150 €" },
      { name: "Protinio danties rovimas", price: "100 - 180 €" },
      { name: "Pūlinio atvėrimas ir drenažas", price: "30 - 50 €" },
    ],
  },
  {
    category: "Implantacija",
    items: [
      { name: "Danties implantas (tik sraigtas)", price: "550 - 750 €" },
      { name: "Gijimo galvutės uždėjimas", price: "50 - 70 €" },
      { name: "Sinuso pakėlimo operacija", price: "400 - 800 €" },
      { name: "Kaulo regeneracija (be medžiagų kainos)", price: "nuo 250 €" },
    ],
  },
  {
    category: "Protezavimas",
    items: [
      { name: "Bemetalės keramikos (cirkonio) vainikėlis", price: "380 - 480 €" },
      { name: "Laikinas vainikėlis (pagamintas klinikoje)", price: "40 - 100 €" },
      { name: "Lanko atraminis protezas", price: "600 - 900 €" },
      { name: "Pilna arba dalinė viršutinio/apatinio žandikaulio plokštelė", price: "350 - 600 €" },
    ],
  },
  {
    category: "Estetika ir balinimas",
    items: [
      { name: "Dantų balinimas kapomis (namuose)", price: "120 - 150 €" },
      { name: "Ofisinis dantų balinimas (klinikoje)", price: "200 - 280 €" },
      { name: "Vieno danties vidinis balinimas", price: "40 - 60 €" },
      { name: "Dantų papuošalas (Skyce)", price: "50 €" },
    ],
  },
];

export default function KainosPage() {
  return (
    <div className="kainos-page py-5" style={{ backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
      <div className="container">
        {/* Antraštė */}
        <div className="text-center mb-5">
          <h1 className="service-heading-clean">Kainynas</h1>
          <div className="heading-underline"></div>
          <p className="text-muted mt-3 mx-auto" style={{ maxWidth: "600px" }}>
            Pateikiamos preliminarios kainos. Tikslus gydymo planas ir galutinė kaina nustatoma po gydytojo apžiūros.
          </p>
        </div>

        {/* Kainų kategorijos */}
        <div className="row g-4">
          {priceCategories.map((cat, index) => (
            <motion.div 
              key={index} 
              className="col-lg-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="price-card shadow-sm bg-white p-4 rounded-4 h-100 border-0">
                <h4 className="category-title mb-4 pb-2 border-bottom fw-bold" style={{ color: "#5d7bb3" }}>
                  {cat.category}
                </h4>
                <div className="price-list">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="price-item d-flex justify-content-between mb-3 align-items-center">
                      <span className="item-name text-dark">{item.name}</span>
                      <span className="item-price fw-bold text-nowrap ms-3" style={{ color: "#2a4f9c" }}>
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Išsimokėjimo blokas */}
<div className="mt-4 p-4 rounded-4 shadow-sm text-white position-relative overflow-hidden"
     style={{ background: "linear-gradient(135deg, #5d7bb3, #2a4f9c)" }}>
  <div className="row align-items-center">
    <div className="col-md-8">
      <h5 className="fw-bold mb-2">Paslaugos išsimokėtinai</h5>
      <p className="mb-0 small">
        Siūlome galimybę už odontologines paslaugas atsiskaityti dalimis.
        Gydymą galite pradėti iš karto, o mokėjimą paskirstyti patogiais mėnesiniais įmokėjimais.
      </p>
    </div>
  </div>
</div>


        {/* PSDF Blokas */}
        <div className="mt-5 p-4 bg-white rounded-4 shadow-sm border-start border-4 border-primary">
          <div className="row align-items-center">
            <div className="col-md-9">
              <h5 className="fw-bold mb-2">Informacija apie kompensacijas</h5>
              <p className="mb-0 text-muted small">
                Pensinio amžiaus asmenims, vaikams ir neįgaliesiems dantų protezavimo paslaugos yra kompensuojamos iš <strong>Privalomojo sveikatos draudimo fondo (PSDF)</strong> biudžeto lėšų pagal nustatytą tvarką.
              </p>
            </div>
            <div className="col-md-3 text-md-end mt-3 mt-md-0">
               <span className="badge p-2 px-3 rounded-pill" style={{ backgroundColor: '#5d7bb3' }}>Sutartis su TLK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}