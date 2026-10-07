import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import logo from '../../assets/logo.png';
import { HOME_PATH } from '../header/header';

export const REPO_URL = 'https://github.com/4ndruxa/patronage_of_military_units';

const Footer: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <footer className="pm-footer pm-on-dark">
      <div className="container">
        <div className="row gy-4 align-items-center">
          <div className="col-lg-5 d-flex align-items-center gap-3">
            <span className="pm-logo-chip"><img src={logo} alt="" /></span>
            <div>
              <strong className="pm-footer__name">Громадське патронування</strong>
              <br />
              <small>Регулярна підтримка військових підрозділів</small>
            </div>
          </div>
          <nav className="col-lg-4" aria-label="Нижня навігація">
            <ul className="list-unstyled d-flex flex-wrap gap-4 mb-0">
              <li><Link to={HOME_PATH}>Збори</Link></li>
              <li><Link to="/organizations">Організації</Link></li>
              {user && <li><Link to="/my-subscriptions">Мої підписки</Link></li>}
            </ul>
          </nav>
          <div className="col-lg-3 text-lg-end"><small>Слава Україні!</small></div>
        </div>
        <hr className="my-4" />
        <small>
          Ми не збираємо гроші: донат ви робите на сторінці організації. Проєкт розробив Андрій Боднар.{' '}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">Код на GitHub</a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;
