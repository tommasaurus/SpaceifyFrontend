import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./navbarFooter.css";
import logo from "../../assets/img/logo.png";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavClick = (e, section) => {
    e.preventDefault();
    // Get the current URL's pathname
    const currentPath = window.location.pathname;

    // Only proceed if we're on the home page
    if (currentPath === "/") {
      let scrollAmount;
      switch (section) {
        case "features":
          scrollAmount = window.innerHeight * 0.8;
          break;
        case "pricing":
          scrollAmount = window.innerHeight * 4.4;
          break;
        case "contact":
          scrollAmount = window.innerHeight * 5.4;
          break;
        default:
          return;
      }

      window.scrollTo({
        top: scrollAmount,
        behavior: "smooth",
      });
    } else {
      // If not on home page, navigate to home page with hash
      window.location.href = `/#${section}`;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Dwellex Logo" />
        </Link>
        {isCollapsed ? (
          <div className="mobile-menu">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <span className="hamburger-icon">☰</span>
            </button>
            {isDropdownOpen && (
              <ul className="nav-menu dropdown">
                <li className="nav-item">
                  <a
                    href="#features"
                    className="nav-link"
                    onClick={(e) => handleNavClick(e, "features")}
                  >
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#pricing"
                    className="nav-link"
                    onClick={(e) => handleNavClick(e, "pricing")}
                  >
                    Pricing
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#contact"
                    className="nav-link"
                    onClick={(e) => handleNavClick(e, "contact")}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <ul className="nav-menu">
            <li className="nav-item">
              <a
                href="#features"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "features")}
              >
                Features
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#pricing"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "pricing")}
              >
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#contact"
                className="nav-link"
                onClick={(e) => handleNavClick(e, "contact")}
              >
                Contact
              </a>
            </li>
            <li className="nav-item">
              <Link to="/login" className="login-button">
                Login
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="navbar-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/">
            <img src={logo} alt="Company Logo" />
          </Link>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li>
                <Link to="/features">Features</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <Link to="/demo">Demo</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/help">Help Center</Link>
              </li>
              <li>
                <Link to="/api">API Documentation</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Spaceify. All rights reserved.</p>
      </div>
    </footer>
  );
};
