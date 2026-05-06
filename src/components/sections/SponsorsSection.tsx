import ScrollReveal from "@/components/ScrollReveal";

export default function SponsorsSection() {
  return (
    <section className="section" id="sponsorluk">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Destekleyenler</p>
            <h2 className="section-title">Sponsorlarımız</h2>
            <p className="section-desc">
              MADOK 2026&apos;yı destekleyen değerli kuruluşlar.
            </p>
          </div>
        </ScrollReveal>

        {/* GOLD */}
        <ScrollReveal>
          <div className="sponsors-tier sponsor-tier-gold" style={{ marginBottom: "2.5rem" }}>
            <p className="sponsors-tier-label">Gold Sponsor</p>
            <div className="sponsors-logos">
              <div className="sponsor-logo-box">Gold Sponsor</div>
              <div className="sponsor-logo-box">Gold Sponsor</div>
            </div>
          </div>
        </ScrollReveal>

        {/* SILVER */}
        <ScrollReveal>
          <div className="sponsors-tier sponsor-tier-silver" style={{ marginBottom: "2.5rem" }}>
            <p className="sponsors-tier-label">Silver Sponsor</p>
            <div className="sponsors-logos">
              <div className="sponsor-logo-box">Silver Sponsor</div>
              <div className="sponsor-logo-box">Silver Sponsor</div>
              <div className="sponsor-logo-box">Silver Sponsor</div>
            </div>
          </div>
        </ScrollReveal>

        {/* BRONZE */}
        <ScrollReveal>
          <div className="sponsors-tier sponsor-tier-bronze">
            <p className="sponsors-tier-label">Bronze Sponsor</p>
            <div className="sponsors-logos">
              <div className="sponsor-logo-box">Bronze Sponsor</div>
              <div className="sponsor-logo-box">Bronze Sponsor</div>
              <div className="sponsor-logo-box">Bronze Sponsor</div>
              <div className="sponsor-logo-box">Bronze Sponsor</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
