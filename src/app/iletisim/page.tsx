import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim | MADOK 2026",
};

export default function IletisimPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "8rem", paddingBottom: "6rem", minHeight: "70vh" }}>
        <div className="section-container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-overline">Bize Ulaşın</p>
              <h2 className="section-title">İletişim Bilgileri</h2>
            </div>
          </ScrollReveal>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><Mail size={24} /></div>
              <h3>E-Posta</h3>
              <p>info@madok2026.com</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><Phone size={24} /></div>
              <h3>Telefon</h3>
              <p>+90 (212) XXX XX XX</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon" style={{ color: "var(--primary-600)" }}><MapPin size={24} /></div>
              <h3>Adres</h3>
              <p>MAKÜ Konferans ve Sergi Salonu, Merkez Kampüs, Burdur, Türkiye</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
