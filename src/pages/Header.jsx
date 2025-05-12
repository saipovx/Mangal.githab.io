import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../scss/header.scss';
import Logo from '../img/Logo.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => {
    const newState = !menuOpen;
    setMenuOpen(newState);
    document.body.classList.toggle('no-scroll', newState);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove('no-scroll');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove('no-scroll'); // safety on unmount
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${showHeader ? "visible" : "hidden"}`}>
      <Link to={'/'} className="logo">
        <img src={Logo} className="logo__img" alt="logo" />
      </Link>

      <div className={`navbar ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={closeMenu}>Главная</Link>
        <Link to="/about" onClick={closeMenu}>Электронное меню</Link>
        <Link to="/Basket" onClick={closeMenu}>Корзинка</Link>
      </div>

      <div className={`burger-menu ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
}
