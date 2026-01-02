"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Jurgita P.",
    text: "Labai bijojau dantų rovimo, bet gydytojai viską atliko taip profesionaliai ir švelniai, kad nieko nepajutau. Ačiū už kantrybę!",
    stars: 5,
  },
  {
    name: "Marius L.",
    text: "Protezavau dantis šioje klinikoje naudodamasis PSDF kompensacija. Viskas buvo paaiškinta aiškiai, o rezultatas pranoko lūkesčius.",
    stars: 5,
  },
  {
    name: "Eglė V.",
    text: "Puiki aplinka ir dar geresni specialistai. Rekomenduoju visiems, kurie ieško kokybės ir nuoširdaus bendravimo.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Pacientų atsiliepimai</h2>
          <div 
            className="mx-auto" 
            style={{ width: "60px", height: "4px", backgroundColor: "#5d7bb3", borderRadius: "2px" }}
          ></div>
        </div>

        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="col-md-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <div className="h-100 p-4 shadow-sm bg-white rounded-4 border-top border-4" style={{ borderColor: "#5d7bb3" }}>
                <div className="text-secondary opacity-25 mb-3">
                  <FaQuoteLeft size={30} />
                </div>
                <p className="fst-italic text-muted mb-4">
                  "{testimonial.text}"
                </p>
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                  <div className="stars text-warning d-flex gap-1">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}