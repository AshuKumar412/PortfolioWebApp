import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const NAV_LINKS = [
  { href: '#about',          label: 'About' },
  { href: '#skills',         label: 'Skills' },
  { href: '#education',      label: 'Education' },
  { href: '#experience',     label: 'Experience' },
  { href: '#projects',       label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#achievements',   label: 'Achievements' },
  { href: '#contact',        label: 'Contact' },
];

export function Navbar({ profileName }) {
  const { theme, toggleTheme } = useTheme();
  const [scrolled,      setScrolled]   = useState(false);
  const [menuOpen,      setMenuOpen]   = useState(false);
  const [activeSection, setActive]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive('#' + entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -60% 0px' }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <nav className="navbar__inner container" aria-label="Main navigation">
        <a href="#hero" className="navbar__logo" aria-label="Go to top">
          <span className="navbar__logo-bracket" aria-hidden="true">&lt;</span>
          <span className="navbar__logo-name">{profileName || 'Portfolio'}</span>
          <span className="navbar__logo-bracket" aria-hidden="true">/&gt;</span>
        </a>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`} role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={`navbar__link ${activeSection === href ? 'navbar__link--active' : ''}`}
                onClick={closeMenu}
              >{label}</a>
            </li>
          ))}
          {/* Admin link — visible in mobile menu */}
          <li className="navbar__admin-mobile">
            <Link to="/admin/login" className="navbar__link" onClick={closeMenu}>
              Admin
            </Link>
          </li>
        </ul>

        <div className="navbar__actions">
          {/* Admin button — desktop only */}
          <Link
            to="/admin/login"
            className="navbar__admin-btn"
            aria-label="Admin dashboard"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
            </svg>
            Admin
          </Link>

          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀' : '🌙'}
          </button>
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      {menuOpen && <div className="navbar__backdrop" onClick={closeMenu} aria-hidden="true" />}
    </header>
  );
}
