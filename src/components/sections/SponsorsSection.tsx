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

        <ScrollReveal>
          <div className="sponsors-tier">
            <p className="sponsors-tier-label">Ana Sponsor</p>
            <div className="sponsors-logos">
              <div className="sponsor-logo main">Ana Sponsor</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sponsors-tier">
            <p className="sponsors-tier-label">Gold Sponsorlar</p>
            <div className="sponsors-logos">
              <div className="sponsor-logo">Gold Sponsor 1</div>
              <div className="sponsor-logo">Gold Sponsor 2</div>
              <div className="sponsor-logo">Gold Sponsor 3</div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="sponsors-tier">
            <p className="sponsors-tier-label">Stand Sponsorları</p>
            <div className="sponsors-logos">
              <div className="sponsor-logo">Stand 1</div>
              <div className="sponsor-logo">Stand 2</div>
              <div className="sponsor-logo">Stand 3</div>
              <div className="sponsor-logo">Stand 4</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
