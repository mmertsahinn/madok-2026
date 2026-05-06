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
      <div style={{ paddingTop: "6rem", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>📋</div>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--text-primary)",
            marginBottom: "1rem",
            fontWeight: 700,
          }}>
            Bilimsel Program
          </h1>
          <div style={{
            display: "inline-block",
            padding: "0.5rem 1.5rem",
            background: "var(--primary-500)",
            color: "white",
            borderRadius: "50px",
            fontFamily: "var(--font-ui)",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            animation: "pulse-badge 2.5s ease-in-out infinite",
          }}>
            Yakında Duyurulacaktır
          </div>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            MADOK 2026 bilimsel programı hazırlanmaktadır. Gelişmeleri takip etmek için sitemizi ziyaret etmeye devam edin.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
