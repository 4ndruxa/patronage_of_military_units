import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDonate } from "@fortawesome/free-solid-svg-icons";
import './header.css';

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("patronage_of_military_units");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center align-items-center pt-3 mb-4 border-bottom">
        <a
          href="/patronage_of_military_units"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
        >
          <FontAwesomeIcon icon={faDonate} className="fs-3 me-2" />
          <span className="fs-4 fw-bold">Громадське патронування</span>
        </a>

        <ul className="nav nav-pills fw-medium">
          <li className="nav-item position-relative">
            <a
              href=""
              className="nav-link text-dark"
              onClick={() => handleTabClick("My-Fundraises")}
            >
              Мої збори
            </a>
            {activeTab === "My-Fundraises" && <div className="highlight"></div>}
          </li>
          <li className="nav-item position-relative">
            <a
              href=""
              className="nav-link text-dark"
              onClick={() => handleTabClick("Add-Fundraise")}
            >
              Додати збір
            </a>
            {activeTab === "My-Fundraises" && <div className="highlight"></div>}
          </li>
          <li className="nav-item position-relative">
            <a
              href=""
              className="nav-link text-dark"
              onClick={() => handleTabClick("Statistics")}
            >
              Статистика
            </a>
            {activeTab === "Statistics" && <div className="highlight"></div>}
          </li>
        </ul>
        <ul className="nav nav-pills ms-3">
          <li className="nav-item">
            <button type="button" className="btn btn-sm btn-light me-2 fw-medium">
              Login
            </button>
          </li>
          <li className="nav-item">
            <button type="button" className="btn btn-sm btn-dark fw-medium">
              Sign-up
            </button>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Header;
