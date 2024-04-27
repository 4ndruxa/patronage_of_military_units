import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import './header.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState("patronage_of_military_units");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    navigate(`/${tabName}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container">
      <nav className="d-flex flex-wrap flex-row justify-content-between align-items-lg-center pt-3 mb-4 border-bottom">
        <a
          className="d-flex align-items-center mb-0 mb-lg-3 mb-md-0 me-md-auto text-dark text-decoration-none cursor-pointer"
          onClick={() => handleTabClick("patronage_of_military_units")}
        >
          <img src={logo} alt="Donate" className="fs-3 me-2 py-1 header-logo" />
          <span className="fs-4 fw-bold">Громадське патронування</span>
        </a>
        <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <FontAwesomeIcon className="text-primary" icon={faBars} />
        </button>

        <div className={`collapse ${isMobile ? 'navbar-collapse' : 'show'}`} id="navbarSupportedContent">
          <div className="d-flex flex-column flex-lg-row align-items-end align-items-lg-center">
            <ul className="nav nav-pills navbar-nav fw-medium d-flex flex-column flex-lg-row align-items-end">
              <li className="nav-item position-relative me-0 me-lg-4">
                <a
                  className="nav-link text-dark cursor-pointer"
                  onClick={() => handleTabClick("organisations")}
                >
                  Організації
                </a>
                {activeTab === "organisation" && <div className="highlight"></div>}
              </li>
              <li className="nav-item dropdown me-0 me-lg-4">
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
                      className="dropdown-item cursor-pointer"
                      onClick={() => handleTabClick("my-subscriptions")}
                    >
                      Мої підписки
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item cursor-pointer"
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
                      className="dropdown-item cursor-pointer"
                      onClick={() => handleTabClick("my-organizations")}
                    >
                      Мої організації
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown me-0 me-lg-4">
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
                      className="dropdown-item cursor-pointer"
                      onClick={() => handleTabClick("add-fundraise")}
                    >
                      Збір
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item cursor-pointer"
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
            <ul className="nav nav-pills ms-3 d-flex flex-column flex-lg-row align-items-end">
              <li className="nav-item">
                <button
                  type="button"
                  className="btn btn-sm btn-light me-0 me-lg-2 mb-2 mb-lg-0 fw-medium"
                  onClick={() => handleLoginClick()}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-sm btn-primary fw-medium">
                  Sign-up
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
