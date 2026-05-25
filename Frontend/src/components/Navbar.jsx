import React, { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  // NAVBAR SCROLL EFFECT

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // NAV LINKS

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "How It Works",
      path: "/how-it-works",
    },

    {
      name: "About",
      path: "/about",
    },
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

              <line
                x1="16"
                y1="1"
                x2="16"
                y2="8"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="16"
                y1="24"
                x2="16"
                y2="31"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="1"
                y1="16"
                x2="8"
                y2="16"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="24"
                y1="16"
                x2="31"
                y2="16"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="4.4"
                y1="4.4"
                x2="9.5"
                y2="9.5"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="22.5"
                y1="22.5"
                x2="27.6"
                y2="27.6"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="27.6"
                y1="4.4"
                x2="22.5"
                y2="9.5"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <line
                x1="9.5"
                y1="22.5"
                x2="4.4"
                y2="27.6"
                stroke="#e5001a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>

          <span className="navbar__logo-text">
            <span className="navbar__logo-find">FindYour</span>

            <span className="navbar__logo-movie">Movie</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}

        <ul className="navbar__links">
          {navLinks.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`navbar__link ${
                  location.pathname === item.path ? "navbar__link--active" : ""
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* THEME BUTTON */}

        <button className="navbar__theme" aria-label="Toggle theme">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />

            <line x1="12" y1="1" x2="12" y2="3" />

            <line x1="12" y1="21" x2="12" y2="23" />

            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />

            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />

            <line x1="1" y1="12" x2="3" y2="12" />

            <line x1="21" y1="12" x2="23" y2="12" />

            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />

            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
