import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-4 pb-3 mt-5">
      <div className="container text-center text-md-start">
        <div className="row">

          {/* About */}
          <div className="col-md-4 mb-3">
            <img src="/images/logo4.jpg" alt="Company Logo" className="navbar-logo" />
            <p>
              Šeimos klinika, teikianti kokybiškas odontologijos 
              ir sveikatos priežiūros paslaugas visai šeimai. Mūsų tikslas – 
              užtikrinti šypseną ir gerą savijautą kiekvienam pacientui.
            </p>
          </div>

          {/* Links */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Mūsų Paslaugos</h5>
            <ul className="list-unstyled">
              <li><a href="/paslaugos/burnos-higiena" className="text-white text-decoration-none">1. Burnos higiena</a></li>
              <li><a href="/paslaugos/plombavimas" className="text-white text-decoration-none">2. Plombavimas</a></li>
              <li><a href="/paslaugos/kanalai" className="text-white text-decoration-none">3. Kanalų gydymas</a></li>
              <li><a href="/paslaugos/dantu-rovimas" className="text-white text-decoration-none">4. Dantų rovimas</a></li>
              <li><a href="/paslaugos/implantavimas" className="text-white text-decoration-none">5. Implantavimas</a></li>
              <li><a href="/paslaugos/protezavimas" className="text-white text-decoration-none">6. Protezavimas</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Susisiekite</h5>
            <p>
              <a 
                href="mailto:gelmidenta@gmail.com" 
                className="text-white text-decoration-none"
              >
                ✉️ gelmidenta@gmail.com
              </a>
            </p>
            <p>
              <a 
                href="tel:+37065776229" 
                className="text-white text-decoration-none"
              >
                📞 +37065776229
              </a>
            </p>
            <p>
              <a 
                href="tel:+37068793063" 
                className="text-white text-decoration-none"
              >
                📞 +37068793063
              </a>
            </p>
            <p>
              <a 
                href="https://www.google.com/maps?q=Nemuno+g.+11,+Panevėžys,+36236+Panevėžio+m.+sav." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white text-decoration-none"
              >
                📍 Nemuno g. 11, Panevėžys, 36236 Panevėžio m. sav.
              </a>
            </p>
          </div>

        </div>

        <div className="text-center mt-3 border-top pt-3">
          &copy; 2025 Gelmidenta. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
