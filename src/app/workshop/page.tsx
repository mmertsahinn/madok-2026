"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WorkshopPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--bg-secondary)", paddingTop: "7rem" }}>

        <section className="section" style={{ paddingBottom: "2rem" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "var(--primary-500)", marginBottom: "0.75rem" }}>
              MADOK 2026
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "var(--neutral-900)", marginBottom: "1rem" }}>
              Workshop Kaydı
            </h1>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: "520px", margin: "0 auto", padding: "0 1.5rem 5rem" }}>
            <div style={{
              background: "white", borderRadius: "20px",
              border: "1px solid var(--neutral-200)", padding: "3.5rem 2.5rem", textAlign: "center",
            }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "#fef2f2", border: "1.5px solid #fca5a5",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.75rem",
              }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 8v7M14 19.5v.5" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="14" cy="14" r="11" stroke="#b91c1c" strokeWidth="1.5"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                Workshop Kayıtları Kapatıldı
              </h2>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "2rem" }}>
                MADOK 2026 workshop kayıt süreci sona ermiştir. Kongremize gösterdiğiniz ilgi için teşekkür ederiz.
              </p>
              <a href="/" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 600,
                color: "var(--primary-600)", background: "none",
                border: "1px solid var(--neutral-200)",
                padding: "0.7rem 1.4rem", borderRadius: "10px", textDecoration: "none",
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
