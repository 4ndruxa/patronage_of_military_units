import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDonate } from "@fortawesome/free-solid-svg-icons";
import './header.css';

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center align-items-center pt-3 mb-4 border-bottom">
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
        >
          <FontAwesomeIcon icon={faDonate} className="fs-3 me-2" />
          <span className="fs-4 fw-bold">Громадське патронування</span>
        </a>

        <ul className="nav nav-pills fw-medium">
          <li className="nav-item position-relative">
            <a
              href="#"
              className="nav-link text-dark"
              onClick={() => handleTabClick("Home")}
            >
              Home
            </a>
            {activeTab === "Home" && <div className="highlight"></div>}
          </li>
          <li className="nav-item position-relative">
            <a
              href="#"
              className="nav-link text-dark"
              onClick={() => handleTabClick("Features")}
            >
              Features
            </a>
            {activeTab === "Features" && <div className="highlight"></div>}
          </li>
          <li className="nav-item position-relative">
            <a
              href="#"
              className="nav-link text-dark"
              onClick={() => handleTabClick("About")}
            >
              About
            </a>
            {activeTab === "About" && <div className="highlight"></div>}
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
