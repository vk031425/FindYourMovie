import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        {/* LOGO */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#e5001a" strokeWidth="2" />
              <circle cx="16" cy="16" r="6" fill="#e5001a" />
              <line x1="16" y1="1" x2="16" y2="8" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="24" x2="16" y2="31" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="16" x2="8" y2="16" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="24" y1="16" x2="31" y2="16" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.4" y1="4.4" x2="9.5" y2="9.5" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="22.5" y1="22.5" x2="27.6" y2="27.6" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="27.6" y1="4.4" x2="22.5" y2="9.5" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
              <line x1="9.5" y1="22.5" x2="4.4" y2="27.6" stroke="#e5001a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="navbar__logo-text">
            <span className="navbar__logo-find">FindYour</span>
            <span className="navbar__logo-movie">Movie</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <ul className="navbar__links">
          {navLinks.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`navbar__link ${location.pathname === item.path ? "navbar__link--active" : ""}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* HAMBURGER (mobile only) */}
        <button
          className={`navbar__hamburger ${menuOpen ? "navbar__hamburger--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`navbar__mobile-menu ${menuOpen ? "navbar__mobile-menu--open" : ""}`}>
        {navLinks.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`navbar__mobile-link ${location.pathname === item.path ? "navbar__mobile-link--active" : ""}`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
