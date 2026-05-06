import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bilimsel Program | MADOK 2026",
  description: "MADOK 2026 bilimsel programı yakında duyurulacaktır.",
};

export default function ProgramPage() {
  return (
    <>
      <Navbar />
      <div style={{
        paddingTop: "6rem",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, var(--bg-primary) 60%, var(--bg-secondary) 100%)",
      }}>
        <div style={{ textAlign: "center", padding: "5rem 2rem", maxWidth: "640px", margin: "0 auto" }}>

          {/* Dekoratif çizgi üst */}
          <div style={{
            width: "48px",
            height: "3px",
            background: "var(--primary-500)",
            margin: "0 auto 2.5rem",
            borderRadius: "2px",
          }} />

          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "var(--primary-500)",
            marginBottom: "1.2rem",
          }}>
            Bilimsel Program
          </p>

          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            color: "var(--text-primary)",
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: "1.8rem",
          }}>
            Program Yakında<br />Duyurulacaktır
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            marginBottom: "2.5rem",
          }}>
            MADOK 2026 bilimsel programı hazırlanmaktadır.<br />
            Güncellemeler için sitemizi takip etmeye devam edin.
          </p>

          {/* Badge */}
          <span style={{
            display: "inline-block",
            padding: "0.55rem 1.6rem",
            border: "1px solid var(--primary-300)",
            color: "var(--primary-600)",
            borderRadius: "50px",
            fontFamily: "var(--font-ui)",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            background: "var(--primary-50)",
          }}>
            Çok Yakında
          </span>

          {/* Dekoratif çizgi alt */}
          <div style={{
            width: "48px",
            height: "3px",
            background: "var(--primary-200)",
            margin: "2.5rem auto 0",
            borderRadius: "2px",
          }} />
        </div>
      </div>
      <Footer />
    </>
  );
}
