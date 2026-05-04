import ScrollReveal from "@/components/ScrollReveal";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

const announcements = [
  {
    date: "4 Mayıs 2026",
    title: "Kayıtlar Başladı",
    desc: "Kongremiz için kayıt dönemi başlamıştır. Sitemiz üzerinden kayıt olabilirsiniz.",
    isNew: true,
  },
  {
    date: "4 Mayıs 2026",
    title: "Bildiri ve Poster Başvuruları",
    desc: "Sözlü bildiri ve poster başvuruları online olarak alınmaya başlanmıştır.",
    isNew: true,
  },
  {
    date: "4 Mayıs 2026",
    title: "Ödeme Bilgileri",
    desc: "Alıcı: M.A.ERSOY ÜNV.REKTÖRLÜĞÜ STRATEJİ GELŞ.DAİRE BŞK. | IBAN: TR 6200 0100 1582 5447 2844 5280",
    isNew: true,
  },
];

export default function IntroSection() {
  return (
    <section className="section" id="intro" style={{ backgroundColor: "#f4f6f8" }}>
      <div className="section-container">
        <div className="intro-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
          
          {/* Main Content: MADOK Nedir? + Duyurular */}
          <div className="intro-left-col" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            <ScrollReveal>
              <div className="intro-about-box" style={{ background: "#0f1c30", color: "white", padding: "2.5rem", borderRadius: "16px" }}>
                <div className="section-header" style={{ marginBottom: "1rem" }}>
                  <h2 className="section-title" style={{ fontSize: "2.2rem", color: "white", marginTop: 0 }}>MADOK Nedir?</h2>
                </div>
                <p className="intro-desc" style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  MADOK, Burdur Mehmet Akif Ersoy Üniversitesi Diş Hekimliği Fakültesi tarafından düzenlenen, 
                  yenilikçi diş hekimliği uygulamaları, klinik araştırmalar ve multidisipliner yaklaşımları 
                  bir araya getiren prestijli bir bilimsel platformdur.
                </p>
                <Link href="/hakkinda" className="btn-primary" style={{ background: "#cba867", color: "white", border: "none" }}>
                  Detaylı Bilgi Al
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="intro-announcements-box" style={{ background: "white", padding: "2rem", borderRadius: "16px", flex: 1 }}>
                <div className="intro-announcements-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "2px solid #f0f0f0", paddingBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.3rem", color: "#0f1c30", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}><Bell size={20} color="#cba867" /> Duyurular</h3>
                  <Link href="/program" style={{ color: "#cba867", fontWeight: 600, fontSize: "0.9rem" }}>Tümünü Gör</Link>
                </div>
                <div className="intro-announcements-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {announcements.map((ann, i) => (
                    <div key={i} className="i-announcement-card" style={{ padding: "1rem", background: "#f8f9fa", borderRadius: "12px", borderLeft: "4px solid #0f1c30" }}>
                      <div className="i-ann-date" style={{ color: "#cba867", fontWeight: 700, fontSize: "0.8rem", marginBottom: "0.3rem" }}>{ann.date}</div>
                      <div className="i-ann-title" style={{ fontWeight: 600, color: "#0f1c30", marginBottom: "0.3rem" }}>{ann.title}</div>
                      <div className="i-ann-desc" style={{ fontSize: "0.8rem", color: "#666" }}>{ann.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
      
      {/* Responsive adjustments */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          .intro-grid { grid-template-columns: 1fr !important; }
        }
      `}}/>
    </section>
  );
}
