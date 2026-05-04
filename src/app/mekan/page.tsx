import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Car, Bus, Plane, Hotel } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konaklama & Ulaşım | MADOK 2026",
  description: "MADOK 2026 kongre mekanı, ulaşım seçenekleri ve konaklama bilgileri.",
};

const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3147.8!2d30.2797!3d37.7126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c6caadb906666b%3A0x679be93952fb72cb!2sBurdur%20Mehmet%20Akif%20Ersoy%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str";

const MAPS_DIRECTIONS =
  "https://www.google.com/maps/dir//Mehmet+Akif+Ersoy+Universitesi+Burdur/@37.7126,30.2797,15z";

export default function MekanPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="packages-hero">
        <div className="section-container">
          <ScrollReveal>
            <p className="section-overline">Konaklama & Ulaşım</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}>
              Kongre Mekanı
            </h1>
            <p className="section-desc" style={{ marginBottom: 0 }}>
              MAKÜ Konferans ve Sergi Salonu — Burdur, Türkiye
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Harita + Adres */}
      <section className="section">
        <div className="section-container">
          <ScrollReveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 400px",
              gap: "2rem",
              alignItems: "start",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
            className="venue-map-grid"
            >
              {/* Harita */}
              <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid var(--neutral-200)", aspectRatio: "16/9" }}>
                <iframe
                  src={MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MAKÜ Konferans ve Sergi Salonu Haritası"
                />
              </div>

              {/* Adres Kutusu */}
              <div style={{
                background: "white",
                border: "1px solid var(--neutral-200)",
                borderRadius: "20px",
                padding: "2rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ color: "var(--primary-600)" }}><MapPin size={22} /></div>
                  <h2 style={{ fontFamily: "var(--font-ui)", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                    Kongre Adresi
                  </h2>
                </div>

                <p style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.4rem" }}>
                  MAKÜ Konferans ve Sergi Salonu
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Mehmet Akif Ersoy Üniversitesi<br />
                  Merkez Kampüs<br />
                  15030 Burdur, Türkiye
                </p>

                <a
                  href={MAPS_DIRECTIONS}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.85rem",
                    background: "var(--primary-600)",
                    color: "white",
                    borderRadius: "10px",
                    fontFamily: "var(--font-ui)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    marginBottom: "0.75rem",
                  }}
                >
                  <MapPin size={16} />
                  Google Maps'te Aç
                </a>

                <a
                  href={`https://maps.apple.com/?q=Mehmet+Akif+Ersoy+Universitesi+Burdur&ll=37.7126,30.2797`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.85rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    borderRadius: "10px",
                    fontFamily: "var(--font-ui)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    border: "1px solid var(--neutral-200)",
                  }}
                >
                  Apple Maps'te Aç
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Ulaşım Seçenekleri */}
      <section className="section section-alt">
        <div className="section-container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-overline">Ulaşım</p>
              <h2 className="section-title">Nasıl Gelinir?</h2>
            </div>
          </ScrollReveal>

          <div className="info-grid">
            <ScrollReveal>
              <div className="info-card">
                <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><Car size={28} /></div>
                <h3>Araçla</h3>
                <p style={{ lineHeight: 1.8 }}>
                  <strong>Antalya</strong> → 175 km (≈ 2,5 saat)<br />
                  <strong>Isparta</strong> → 60 km (≈ 50 dk)<br />
                  <strong>Denizli</strong> → 130 km (≈ 1,5 saat)<br />
                  <strong>Ankara</strong> → 380 km (≈ 4 saat)
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="info-card">
                <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><Plane size={28} /></div>
                <h3>Uçakla</h3>
                <p style={{ lineHeight: 1.8 }}>
                  En yakın havalimanı:<br />
                  <strong>Isparta Süleyman Demirel Havalimanı</strong><br />
                  (ISE) → Burdur: 70 km (≈ 1 saat)<br /><br />
                  İzmir Adnan Menderes (ADB) alternatif, 230 km.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="info-card">
                <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><Bus size={28} /></div>
                <h3>Otobüsle</h3>
                <p style={{ lineHeight: 1.8 }}>
                  Türkiye'nin birçok şehrinden Burdur Şehirlerarası Otobüs Terminali'ne direkt sefer mevcuttur.<br /><br />
                  Terminalden üniversiteye taksi veya dolmuş ile ulaşabilirsiniz (≈ 10 dk).
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="info-card">
                <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><Hotel size={28} /></div>
                <h3>Konaklama</h3>
                <p style={{ lineHeight: 1.8 }}>
                  Kongre süresince anlaşmalı otellerde özel fiyat imkânı sunulmaktadır.<br /><br />
                  Detaylı bilgi ve rezervasyon için:<br />
                  <a href="/iletisim" style={{ color: "var(--primary-600)", fontWeight: 600 }}>İletişime Geçin →</a>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-container">
          <ScrollReveal>
            <div className="cta-content">
              <h2>Yerinizi Ayırtın</h2>
              <p>Kontenjan sınırlıdır. Erken kayıt avantajlarından yararlanmak için hemen başvurun.</p>
              <div className="cta-buttons">
                <a href="/paketler" className="btn-gold">
                  Kayıt Ol
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href={MAPS_DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn-outline-white">
                  Yol Tarifi Al →
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .venue-map-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
