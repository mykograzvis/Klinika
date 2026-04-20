"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaUserMd, FaAward, FaHeartbeat, FaMicroscope } from "react-icons/fa";
import "../style.css";

import Testimonials from "@/components/testimonials";

export default function ApieMus() {
  return (
    <div className="page container py-5">
      <motion.div
        className="burnos-hero text-center text-white d-flex align-items-center justify-content-center mb-5"
        style={{
          backgroundImage: 'url(/images/kabinetas.jpeg)',
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "15px",
          minHeight: "350px"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-dark bg-opacity-25 p-4 rounded">
          <h1 className="burnos-title mb-3">Apie mūsų kliniką</h1>
          <p className="lead">Daugiau nei 10 metų rūpinamės Jūsų šypsenomis.</p>
        </div>
      </motion.div>

      <div className="row align-items-center py-5">
        <motion.div 
          className="col-md-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="burnos-text p-4 shadow-sm rounded border-start border-4 border-primary">
            <h2 className="mb-4">Mūsų filosofija</h2>
            <p>
              Mūsų klinika įsikūrė turint vieną tikslą – suteikti aukščiausios kokybės odontologines 
              paslaugas jaukioje ir saugioje aplinkoje. Tikime, kad sveika šypsena prasideda nuo 
              pasitikėjimo, todėl kiekvienam pacientui skiriame ypatingą dėmesį.
            </p>
            <p>
              Mes nuolatos investuojame į moderniausią įrangą ir gydytojų kvalifikacijos kėlimą, 
              kad galėtume pasiūlyti sprendimus net sudėtingiausiose situacijose.
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="col-md-6 text-center mt-4 mt-md-0"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/images/aboutUs.jpg" 
            alt="Mūsų komanda darbe"
            width={600}
            height={400}
            className="img-fluid rounded shadow-lg"
            style={{ borderRadius: "28px", border: "4px solid #e3eaf3" }}
          />
        </motion.div>
      </div>

      <div className="row g-4 py-5 text-center">
        <h2 className="mb-5">Kodėl verta rinktis mus?</h2>
        
        {[
          { icon: <FaUserMd size={40} />, title: "Patyrę specialistai", desc: "Mūsų gydytojai yra savo srities profesionalai, nuolat besistažuojantys užsienyje." },
          { icon: <FaMicroscope size={40} />, title: "Moderni įranga", desc: "Dirbame su šiuolaikiška ir patikima įranga, kuri leidžia užtikrinti tikslų gydymą bei aukščiausią paslaugų kokybę."  },
          { icon: <FaAward size={40} />, title: "Garantuota kokybė", desc: "Visiems atliktiems darbams suteikiame ilgalaikę kokybės garantiją." },
          { icon: <FaHeartbeat size={40} />, title: "Be skausmo", desc: "Taikome pažangius nuskausminimo metodus, užtikrinančius komfortą." }
        ].map((item, index) => (
          <motion.div 
            key={index}
            className="col-md-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="p-4 shadow-sm h-100 bg-white" style={{ borderRadius: "20px", borderBottom: "4px solid #5d7bb3" }}>
              <div className="text-primary mb-3">{item.icon}</div>
              <h5 className="fw-bold">{item.title}</h5>
              <p className="small text-muted mb-0">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="row text-center py-5 my-5 text-white rounded shadow-lg"
        style={{ backgroundColor: "#5d7bb3" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="col-md-4">
          <h2 className="fw-bold">10+</h2>
          <p>Metų patirtis</p>
        </div>
        <div className="col-md-4 border-start border-end border-white border-opacity-25">
          <h2 className="fw-bold">5000+</h2>
          <p>Laimingų pacientų</p>
        </div>
        <div className="col-md-4">
          <h2 className="fw-bold">15+</h2>
          <p>Sertifikuotų specialistų</p>
        </div>
      </motion.div>

      <Testimonials />
    </div>
  );
}