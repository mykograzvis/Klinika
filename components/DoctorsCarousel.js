"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./DoctorsCarousel.css";

const doctors = [
  { name: "Gelmina Mykolaitienė", specialization: "Odontologė", image: "/images/Agne.jpg" },
  { name: "Sigita Šilalienė", specialization: "Odontologė", image: "/images/neringa.jpg" },
  { name: "Deimantė Bambonienė", specialization: "Higienistė", image: "/images/juste.jpg" },
  { name: "Ingrida Daščioraitė", specialization: "Odontologė", image: "/images/neringa.jpg" },
  { name: "Ignė Sniečkuvienė", specialization: "Odontologė", image: "/images/neringa.jpg" },
  { name: "Lina Narkūnė", specialization: "Odontologė", image: "/images/neringa.jpg" },
  { name: "Aušvydas Baltuonis", specialization: "Chirurgas", image: "/images/ugnius.jpg" },
  { name: "Judita Montvilienė", specialization: "Odontologė", image: "/images/neringa.jpg" },
];

function DoctorsCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2, centerMode: false } },
      { breakpoint: 576, settings: { slidesToShow: 1, centerMode: false } }
    ]
  };

  return (
    <div className="doctors-section py-5">
      <div className="container">
        <div className="text-center mb-5">
                <h2 className="text-center mb-5 service-heading">

        <span className="line"></span>

        Klinikos specialistai

        <span className="line"></span>

      </h2>
          <div className="heading-underline"></div>
        </div>

        <Slider {...settings} className="doctors-slider">
          {doctors.map((doc, index) => (
            <div key={index} className="px-3 py-4">
              <div className="doctor-card text-center shadow-sm">
                <div className="doctor-image-wrapper">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="doctor-img"
                  />
                </div>
                <div className="doctor-info p-4">
                  <h5 className="doc-name">{doc.name}</h5>
                  <p className="doc-spec text-muted">{doc.specialization}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default DoctorsCarousel;