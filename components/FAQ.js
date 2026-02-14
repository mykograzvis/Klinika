"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  {
    question: "Ar paslaugos kompensuojamos iš PSDF biudžeto?",
    answer: "Taip, mūsų klinika yra sudariusi sutartį su Teritorinėmis ligonių kasomis, todėl senjorams, vaikams ir asmenims, kuriems nustatytas tam tikras darbingumo lygis, dantų protezavimo paslaugos kompensuojamos PSDF lėšomis.",
  },
  {
    question: "Kaip pasiruošti pirmajam vizitui?",
    answer: "Pirmojo vizito metu atliekama išsami burnos apžiūra. Rekomenduojame su savimi turėti asmens dokumentą. Jei turite neseniai darytą panoraminę rentgeno nuotrauką, galite ją atsinešti.",
  },
  {
    question: "Ar procedūros yra skausmingos?",
    answer: "Tikrai ne. Šiuolaikinė odontologija leidžia užtikrinti visišką komfortą. Naudojame saugius ir stiprius vietinius nuskausminamuosius, tad net ir sudėtingiausių procedūrų metu pacientai skausmo nejaučia.",
  },
  {
    question: "Koks yra garantinis laikotarpis?",
    answer: "Visiems atliktiems darbams suteikiame garantiją. Plomboms taikoma 1 metų garantija, o implantams ir protezams – priklausomai nuo gamintojo specifikacijų, tačiau visada užtikriname ilgalaikį rezultatą laikantis gydytojo rekomendacijų.",
  },
  {
    question: "Kiek laiko trunka pirminė konsultacija?",
    answer: "Pirminė konsultacija paprastai trunka apie 15–45 minutes. Per šį laiką gydytojas ne tik apžiūri dantis, bet ir išklauso Jūsų lūkesčius, sudaro preliminarų gydymo planą bei aptaria galimas išlaidas.",
  },
  {
    question: "Ką daryti pajutus ūmų danties skausmą?",
    answer: "Ūmaus skausmo atveju stengiamės pacientus priimti tą pačią dieną. Jei pajutote stiprų skausmą ar atsirado patinimas, nedelsdami skambinkite mūsų klinikos telefonu – surasime artimiausią laisvą laiką skubiai pagalbai.",
  },
  {
    question: "Ar galima už paslaugas mokėti išsimokėtinai?",
    answer: "Taip, bendradarbiaujame su lizingo bendrovėmis, todėl už brangesnes procedūras (pavyzdžiui, implantaciją ar protezavimą) galite atsiskaityti dalimis Jums patogiu grafiku.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-5 mb-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="service-heading-clean">Dažniausiai užduodami klausimai</h2>
          <div className="heading-underline"></div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className="faq-item mb-3 shadow-sm rounded-4 overflow-hidden"
                style={{ backgroundColor: "#fff" }}
              >
                <button
                  className="w-100 border-0 p-4 text-start d-flex justify-content-between align-items-center bg-transparent"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="fw-bold h6 mb-0" style={{ color: "#2a4f9c" }}>
                    {item.question}
                  </span>
                  <span style={{ color: "#5d7bb3" }}>
                    {activeIndex === index ? <FaMinus /> : <FaPlus />}
                  </span>
                </button>

                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 text-muted border-top pt-3 mx-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}