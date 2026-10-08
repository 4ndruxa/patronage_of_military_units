import React from 'react';
import photo from '../../assets/hero-background.webp';
import Icon from '../ui/icon';

// «Кому ми допомагаємо» (mockups/v2/01-home.html): the photo under the catalog,
// framed on the flag and the standing figure so no weapon is in the shot.
const PhotoStrip: React.FC = () => (
  <section className="pm-section pt-0" aria-labelledby="photo-title">
    <div className="container">
      <div className="pm-photo">
        <img
          src={photo}
          alt="Ілюстрація: український прапор у небі над захисником"
          loading="lazy"
          decoding="async"
        />
        <div className="pm-photo__body">
          <span className="pm-eyebrow">Кому ми допомагаємо</span>
          <h2 id="photo-title">За кожним збором стоять люди, які тримають оборону</h2>
          <p className="mb-4">
            Підрозділи, яким потрібні транспорт, дрони, медицина і зв'язок. Ми лише збираємо їхні збори в одному місці.
          </p>
          <a className="btn btn-donate" href="#zbory">
            Переглянути збори <Icon name="arrow" className="pm-i-end" />
          </a>
        </div>
        <span className="pm-photo__credit" aria-hidden="true">Ілюстрація</span>
      </div>
    </div>
  </section>
);

export default PhotoStrip;
