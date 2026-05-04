import ScrollReveal from "@/components/ScrollReveal";

export default function CtaSection() {
  return (
    <section className="cta-section">
      <div className="section-container">
        <ScrollReveal>
          <div className="cta-content">
            <h2>MADOK 2026&apos;ya Katılın</h2>
            <p>
              Bilimin geleceğini şekillendiren bu önemli organizasyonda yerinizi alın.
              Erken kayıt avantajlarından yararlanın.
            </p>
            <div className="cta-buttons">
              <a href="/paketler" className="btn-gold">
                Kayıt Ol
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/bildiri" className="btn-outline-white">
                Bildiri Gönder
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
