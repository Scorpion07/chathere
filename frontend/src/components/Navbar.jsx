import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detect scroll to make navbar translucent or solid
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🤖</span> ChatVerse
        </Link>

        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" || location.pathname === "/home" ? "active" : ""}>
            Home
          </Link>
          <Link to="/chat" className={location.pathname === "/chat" ? "active" : ""}>
            Chat
          </Link>
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
