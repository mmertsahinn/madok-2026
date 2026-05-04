"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          MADOK
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-nav ${mobileOpen ? "open" : ""}`}>
          <li>
            <Link href="/">Ana Sayfa</Link>
          </li>
          <li>
            <span className="nav-dropdown-trigger">
              Kongre
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="nav-dropdown">
              <Link href="/hakkinda">Kongre Hakkında</Link>
              <Link href="/program">Bilimsel Program</Link>
              <Link href="/konusmacilar">Konuşmacılar</Link>
              <Link href="/komiteler">Komiteler</Link>
            </div>
          </li>
          <li>
            <span className="nav-dropdown-trigger">
              Katılım
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <div className="nav-dropdown">
              <Link href="/paketler">Kayıt & Paketler</Link>
              <Link href="/odeme">Ödeme & Dekont</Link>
              <Link href="/bildiri">Bildiri Gönder</Link>
              <Link href="/poster">Poster Gönder</Link>
              <Link href="/mekan">Konaklama & Ulaşım</Link>
            </div>
          </li>
          <li>
            <Link href="/konusmacilar">Konuşmacılar</Link>
          </li>
          <li>
            <Link href="/sponsorluk">Sponsorluk</Link>
          </li>
          <li>
            <Link href="/iletisim">İletişim</Link>
          </li>
          <li>
            <Link href="/paketler" className="nav-cta">
              Kayıt Ol
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
