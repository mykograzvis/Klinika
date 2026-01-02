// pages/index.js
"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import DoctorsCarousel from "../components/DoctorsCarousel";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ServicesSection from "../components/ServicesSection"; // new file
import FAQ from "../components/FAQ";
import ContactSection from "../components/Contact";
import "../styles/Home.css";

export default function HomePage() {
  return (
    <>
      <Hero />

      <ServicesSection /> {/* motion cards moved here */}

      <DoctorsCarousel />

      <ScrollToTopButton />
      
      <FAQ />

      <ContactSection />
    </>
  );
}
