import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Komiteler | MADOK 2026",
};

export default function KomitelerPage() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "8rem", paddingBottom: "6rem", minHeight: "60vh" }}>
        <div className="section-container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-overline">Organizasyon</p>
              <h2 className="section-title">Kongre Komitesi</h2>
              <p className="section-desc">
                MADOK 2026 komite üyeleri çok yakında duyurulacaktır.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <Footer />
    </>
  );
}
