"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import DoctorsCarousel from "../../components/DoctorsCarousel";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import ServicesSection from "../../components/ServicesSection";
import FAQ from "../../components/FAQ";
import ContactSection from "../../components/Contact";
import Testimonials from "../../components/testimonials";
import "../../styles/Home.css";

export default function HomePage() {
  return (
    <main className="homepage-main">
      <section className="section-hero">
        <Hero />
      </section>

      <section className="section-services">
        <div className="section-container">
          <ServicesSection />
        </div>
      </section>

      <section className="section-stats">
        <div className="section-container">
          <StatsBar />
        </div>
      </section>

      <section className="section-testimonials">
        <div className="section-container">
          <Testimonials />
        </div>
      </section>

      <section className="section-faq">
        <div className="section-container">
          <FAQ />
        </div>
      </section>

      <section className="section-contact">
        <div className="section-wave-top" />
        <div className="section-container">
          <ContactSection />
        </div>
      </section>

      <ScrollToTopButton />
    </main>
  );
}

function StatsBar() {
  const stats = [
    { number: "10+", label: "Metų patirties" },
    { number: "5,000+", label: "Patenkintų pacientų" },
    { number: "15+", label: "Specialistų komanda" },
    { number: "99%", label: "Rekomendacijų rodiklis" },
  ];

  return (
    <motion.div 
      className="stats-grid"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          className="stat-item"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <span className="stat-number">{stat.number}</span>
          <span className="stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}