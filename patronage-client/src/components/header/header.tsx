import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDonate } from "@fortawesome/free-solid-svg-icons";
import './header.css';
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("patronage_of_military_units");

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    navigate(`/${tabName}`);
  };

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center align-items-center pt-3 mb-4 border-bottom">
        <a
          href="/patronage_of_military_units"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none cursor-pointer"
        >
          <FontAwesomeIcon icon={faDonate} className="fs-3 me-2" />
          <span className="fs-4 fw-bold">Громадське патронування</span>
        </a>

        <ul className="nav nav-pills fw-medium">
          <li className="nav-item position-relative">
            <a
              className="nav-link text-dark cursor-pointer"
              onClick={() => handleTabClick("organisation")}
            >
              Організації
            </a>
            {activeTab === "organisation" && <div className="highlight"></div>}
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-dark cursor-pointer"
              id="profileDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Профіль
            </a>
            <ul className="dropdown-menu" aria-labelledby="profileDropdown">
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleTabClick("my-subscriptions")}
                >
                  Мої підписки
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleTabClick("my-fundraises")}
                >
                  Мої збори
                </a>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleTabClick("my-organizations")}
                >
                  Мої організації
                </a>
              </li>
            </ul>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle text-dark cursor-pointer"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Додати
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleTabClick("add-fundraise")}
                >
                  Збір
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  onClick={() => handleTabClick("add-organization")}
                >
                  Організацію
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item position-relative">
            <a
              className="nav-link text-dark cursor-pointer"
              onClick={() => handleTabClick("statistics")}
            >
              Статистика
            </a>
            {activeTab === "statistics" && <div className="highlight"></div>}
          </li>
        </ul>
        <ul className="nav nav-pills ms-3">
          <li className="nav-item">
            <button
              type="button"
              className="btn btn-sm btn-light me-2 fw-medium"
              onClick={() => handleLoginClick()}
            >
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