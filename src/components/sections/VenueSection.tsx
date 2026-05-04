import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Car, Hotel, Phone } from "lucide-react";

export default function VenueSection() {
  return (
    <section className="section section-alt" id="mekan">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Konaklama & Ulaşım</p>
            <h2 className="section-title">Kongre Merkezi</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="venue-card">
            <div className="venue-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1576.4385108053186!2d30.279762198305!3d37.71261314995955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c6caadb906666b%3A0x679be93952fb72cb!2sBurdur%20Mehmet%20Akif%20Ersoy%20%C3%9Cniversitesi%20Di%C5%9F%20Hekimli%C4%9Fi%20Fak%C3%BCltesi!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kongre Merkezi Harita"
              ></iframe>
            </div>
            <div className="venue-details">
              <h3>MAKÜ Konferans ve Sergi Salonu</h3>
              <p className="venue-subtitle">Burdur, Türkiye</p>

              <div className="venue-info-list" style={{ color: "var(--primary-600)"}}>
                <div className="venue-info-item">
                  <div className="venue-info-icon"><MapPin size={20} /></div>
                  <div className="venue-info-text">
                    <h4>Adres</h4>
                    <p>MAKÜ Konferans ve Sergi Salonu, İstiklal Yerleşkesi, Burdur</p>
                  </div>
                </div>
                <div className="venue-info-item">
                  <div className="venue-info-icon"><Car size={20} /></div>
                  <div className="venue-info-text">
                    <h4>Ulaşım</h4>
                    <p>Havalimanından 30 dk, merkeze 15 dk mesafe</p>
                  </div>
                </div>
                <div className="venue-info-item">
                  <div className="venue-info-icon"><Hotel size={20} /></div>
                  <div className="venue-info-text">
                    <h4>Konaklama</h4>
                    <p>Anlaşmalı oteller için iletişime geçin</p>
                  </div>
                </div>
                <div className="venue-info-item">
                  <div className="venue-info-icon"><Phone size={20} /></div>
                  <div className="venue-info-text">
                    <h4>İletişim</h4>
                    <p>info@madok2026.com · +90 (XXX) XXX XX XX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
