"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaChevronRight } from "react-icons/fa";
import "./Hero.css";

const slides = [
  { filename: "background1.jpg", title: "Greita ir kokybiška odontologinė pagalba", subtitle: "" },
  { filename: "background2.jpg", title: "Dantų protezavimas PSDF biudžeto lėšomis", subtitle: "" },
  { filename: "background3.jpg", title: "Nemokama dantų apžiūra vaikams", subtitle: "" },
];

const getPublicPath = (filename) => `/images/${filename}`;

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const totalSlides = slides.length;
  const nextImageIndex = (currentImageIndex + 1) % totalSlides;

  const triggerNextSlide = useCallback(() => {
    if (!isFading) {
      setIsFading(true);
    }
  }, [isFading]);

  useEffect(() => {
    const timeoutId = setTimeout(triggerNextSlide, 7000);
    return () => clearTimeout(timeoutId);
  }, [currentImageIndex, triggerNextSlide]);

  useEffect(() => {
    if (isResetting) {
      const timeoutId = setTimeout(() => setIsResetting(false), 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isResetting]);

  const handleTransitionEnd = () => {
    if (isFading) {
      setCurrentImageIndex(nextImageIndex);
      setIsFading(false);
      setIsResetting(true);
    }
  };

  const currentSlide = slides[currentImageIndex];
  const nextSlide = slides[nextImageIndex];

  return (
    <section className="hero-section">
      <div className="hero-background bottom-layer" style={{ backgroundImage: `url(${getPublicPath(nextSlide.filename)})` }}></div>

      <div
        className={`hero-background top-layer ${isFading ? "fading" : ""} ${isResetting ? "resetting" : ""}`}
        style={{ backgroundImage: `url(${getPublicPath(currentSlide.filename)})` }}
        onTransitionEnd={handleTransitionEnd}
      ></div>

      <div className="hero-overlay"></div>

      {}
      <button 
        className="hero-nav-button right" 
        onClick={triggerNextSlide}
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      <div className={`hero-content ${isFading ? "content-fading" : ""}`}>
        <h1>{currentSlide.title}</h1>
        <p>{currentSlide.subtitle}</p>
        <div className="hero-buttons">
          <a href="tel:+37065776229" className="btn btn-outline-light ms-3 phone-button">
            <i className="bi bi-telephone-fill me-2"></i>+370 657 76229
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;