import React from "react";
import heroImage from "../../assets/hero.jpeg";

const Hero: React.FC = () => {
  return (
    <div className="col-12 container">
      <div className="card d-flex align-items-start flex-md-row mb-4 border-0">
        <img
          className="card-img-right flex-auto col-5 object-fit-contain"
          src={heroImage}
          data-holder-rendered="true"
          alt="hero"
        ></img>
        <div className="card-body pt-0 d-flex flex-column align-items-start">
          <h3 className="mb-2">
            <div className="text-dark">
              Веб-платформа для громадського патронування військових підрозділів
            </div>
          </h3>
          <div className="card-text mb-auto fs-14">
            Власники збору зможуть сформувати запити - списки зборів.
            <p>
              Cписок зборів, де користувач (патронат) зможе обрати той, який
              йому важливий для того, щоб "підписатись", після чого користувачу
              (патронату) приходитиме регулярне сповіщення про необхідність
              задонанити.
            </p>
            <div>В чому користь такої платформи:</div>
            <ul>
              <li>
                В одному місці можна побачити підрозділи, де є першочергова
                необхідність в підтримці;
              </li>
              <li>
                Завдяки платформі можна буде вести безперебійну підтримку,
                оскільки окрім масштабних покупок, військові потребують також і
                розхідні матеріали, такі як пальне, запчастини для транспорту,
                медикаменти, тощо. Для таких витрат важливо отримувати регулярну
                фінансову підтримку.
              </li>
            </ul>
            <p className="fw-semibold">Виконав: ФІОТ 123 КІ студент групи ІО-23 Боднар Андрій</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
