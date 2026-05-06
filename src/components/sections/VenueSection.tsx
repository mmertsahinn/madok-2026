import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Car, Hotel, Phone } from "lucide-react";

export default function VenueSection() {
  return (
    <section className="section section-alt" id="mekan">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Kongre Mekanı</p>
            <h2 className="section-title">Kongre Merkezi</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="venue-card">
            <div className="venue-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3134.56!2d30.2708916!3d37.7150512!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c42c1f95b9b0eb%3A0xacb30f70df8f825b!2sMehmet%20Akif%20Ersoy%20%C3%9Cniversitesi%20Konferans%20Ve%20Sergi%20Salonu!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kongre Merkezi Harita"
              ></iframe>
            </div>
            <div className="venue-details">
              <h3>Kongre ve Sergi Salonu</h3>
              <p className="venue-subtitle">Mehmet Akif Ersoy Üniversitesi, Burdur</p>

              <div className="venue-info-list" style={{ color: "var(--primary-600)"}}>
                <div className="venue-info-item">
                  <div className="venue-info-icon"><MapPin size={20} /></div>
                  <div className="venue-info-text">
                    <h4>Adres</h4>
                    <p>Mehmet Akif Ersoy Üniversitesi Kongre ve Sergi Salonu, Burdur</p>
                  </div>
                </div>
                <div className="venue-info-item">
                  <div className="venue-info-icon"><Car size={20} /></div>
                  <div className="venue-info-text">
                    <h4>Ulaşım</h4>
                    <p>Şehir merkezine 10 dk mesafe, ücretsiz otopark mevcuttur</p>
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
                    <p>madok.2026.burdur@gmail.com</p>
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
