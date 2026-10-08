import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-640.webp";
import Icon from "../ui/icon";

// The logo in a soft sky circle with a static glow; ring and dots are decoration.
const HeroLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pm-hero-logo ${className}`}>
    <i aria-hidden="true"></i>
    <i aria-hidden="true"></i>
    <img src={logo} alt="Логотип: руки тримають щит" width={320} height={320} />
  </div>
);

// Home hero (mockups/v2/01-home.html): one dominant object, the headline and two
// actions above the fold. No numbers here until there is an API for them (D16).
const Hero: React.FC = () => (
  <section className="pm-hero" aria-labelledby="hero-title">
    <div className="container">
      <div className="row align-items-center gy-3">
        <div className="col-lg-7">
          <HeroLogo className="d-lg-none" />
          <span className="pm-eyebrow">Регулярна підтримка військових підрозділів</span>
          <h1 className="pm-display" id="hero-title">
            Підтримуйте підрозділи <em>щомісяця</em>, а не раз на рік
          </h1>
          <p className="pm-lead mt-3 mb-4">
            Оберіть збір і підпишіться: раз на місяць ми нагадаємо вам про нього в застосунку.
            Гроші ми не збираємо: донат ви робите на сторінці організації.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <a className="btn btn-donate btn-lg" href="#zbory">
              Переглянути збори <Icon name="arrow" className="pm-i-end" />
            </a>
            <Link className="btn btn-outline-ink btn-lg" to="/organizations">Організації</Link>
          </div>
        </div>
        <div className="col-lg-5 d-none d-lg-block">
          <HeroLogo />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
