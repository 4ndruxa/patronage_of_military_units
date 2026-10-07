import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/api/auth/auth';

export const HOME_PATH = '/patronage_of_military_units';

// "Олена Коваль" -> "ОК"; a single word gives one letter.
// Empty or whitespace-only input gives "?".
export const getInitials = (name?: string | null): string =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0].toUpperCase())
    .join('') || '?';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, status } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Collapse the mobile menu once the user picks a page.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = async () => {
    await logoutUser();
    dispatch(logout());
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  // «Збори» is the home page; fundraising details belong to it too.
  const isFundraisingsActive =
    location.pathname === HOME_PATH || location.pathname.startsWith('/fundraisings/');

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg sticky-top pm-nav" aria-label="Головна навігація">
      <div className="container">
        <Link className="navbar-brand" to={HOME_PATH} onClick={closeMenu}>
          <img src={logo} alt="" width={44} height={44} />
          <span>Громадське<br className="d-sm-none" /> патронування</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="pm-nav-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Закрити меню' : 'Відкрити меню'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`} id="pm-nav-menu">
          <ul className="navbar-nav ms-lg-auto align-items-lg-center">
            <li className="nav-item">
              <Link
                className={`nav-link${isFundraisingsActive ? ' active' : ''}`}
                aria-current={isFundraisingsActive ? 'page' : undefined}
                to={HOME_PATH}
                onClick={closeMenu}
              >
                Збори
              </Link>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/organizations" onClick={closeMenu}>
                Організації
              </NavLink>
            </li>
            {user ? renderUserMenu() : (status === 'succeeded' || status === 'failed') && renderLogin()}
          </ul>
        </div>
      </div>
    </nav>
  );

  function renderLogin() {
    return (
      <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
        <button type="button" className="btn btn-primary" onClick={handleLoginClick}>
          Увійти
        </button>
      </li>
    );
  }

  function renderUserMenu() {
    return (
      <li className="nav-item dropdown ms-lg-3">
        <button
          type="button"
          className="nav-link dropdown-toggle d-flex align-items-center gap-2 border-0 pm-avatar-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          aria-label={`Меню користувача ${user?.name ?? ''}`.trim()}
        >
          <span className="pm-avatar" aria-hidden="true">{getInitials(user?.name?.trim() || user?.email)}</span>
          <span className="d-lg-none" aria-hidden="true">{user?.name}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li><Link className="dropdown-item" onClick={closeMenu} to="/my-subscriptions">Мої підписки</Link></li>
          <li><Link className="dropdown-item" onClick={closeMenu} to="/my-fundraisings">Мої збори</Link></li>
          <li><Link className="dropdown-item" onClick={closeMenu} to="/my-organizations">Мої організації</Link></li>
          <li><hr className="dropdown-divider" /></li>
          <li><Link className="dropdown-item" onClick={closeMenu} to="/add-fundraising">Додати збір</Link></li>
          <li><Link className="dropdown-item" onClick={closeMenu} to="/add-organization">Додати організацію</Link></li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button type="button" className="dropdown-item" onClick={handleLogoutClick}>
              Вийти
            </button>
          </li>
        </ul>
      </li>
    );
  }
};

export default Header;
