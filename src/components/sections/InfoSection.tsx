import ScrollReveal from "@/components/ScrollReveal";
import React from "react";

const infoRows = [
  { label: "Tarih",              value: "19 – 21 Haziran 2026" },
  { label: "Şehir",             value: "Burdur, Türkiye" },
  { label: "Mekân",             value: "MAKÜ Konferans ve Sergi Salonu" },
  { label: "Kongre Türü",       value: "Yüz yüze (fiziksel katılım)" },
  { label: "Bilimsel Dil",      value: "Türkçe & İngilizce" },
  { label: "Kontenjan",         value: "500 katılımcı" },
];

const stats = [
  { value: "3",    label: "Tam Gün" },
  { value: "500+", label: "Katılımcı" },
  { value: "2",    label: "Bilimsel Dil" },
];

export default function InfoSection() {
  return (
    <section className="section section-alt" id="bilgi">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Kongre Bilgileri</p>
            <h2 className="section-title">Temel Bilgiler</h2>
            <p className="section-desc">
              MADOK 2026 kongresi hakkında bilmeniz gereken her şey.
            </p>
          </div>
        </ScrollReveal>

        {/* Fact Sheet */}
        <ScrollReveal>
          <div style={factSheet}>
            {infoRows.map((row, i) => (
              <div key={i} style={{ ...factRow, borderBottom: i < infoRows.length - 1 ? "1px solid var(--neutral-200)" : "none" }}>
                <div style={factLabel}>{row.label}</div>
                <div style={factValue}>{row.value}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Stat Strip */}
        <ScrollReveal>
          <div style={statStrip}>
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={statDivider} />}
                <div style={statCell}>
                  <div style={statNum}>{s.value}</div>
                  <div style={statLabel}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── STYLES ── */
const factSheet: React.CSSProperties = {
  border: "1px solid var(--neutral-200)",
  borderRadius: "18px",
  overflow: "hidden",
  background: "white",
};

const factRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "200px 1fr",
  transition: "background 0.2s",
};

const factLabel: React.CSSProperties = {
  padding: "1.35rem 2rem",
  fontFamily: "var(--font-ui)",
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "2px",
  color: "var(--text-muted)",
  borderRight: "1px solid var(--neutral-200)",
  display: "flex",
  alignItems: "center",
};

const factValue: React.CSSProperties = {
  padding: "1.35rem 2rem",
  fontFamily: "var(--font-ui)",
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "var(--text-primary)",
  display: "flex",
  alignItems: "center",
};

const statStrip: React.CSSProperties = {
  display: "flex",
  marginTop: "1.25rem",
  border: "1px solid var(--neutral-200)",
  borderRadius: "16px",
  overflow: "hidden",
  background: "white",
};

const statCell: React.CSSProperties = {
  flex: 1,
  padding: "1.8rem 1.5rem",
  textAlign: "center",
};

const statDivider: React.CSSProperties = {
  width: "1px",
  background: "var(--neutral-200)",
  flexShrink: 0,
};

const statNum: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: "2.2rem",
  fontWeight: 700,
  color: "var(--primary-600)",
  lineHeight: 1,
  marginBottom: "0.4rem",
};

const statLabel: React.CSSProperties = {
  fontFamily: "var(--font-ui)",
  fontSize: "0.72rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "var(--text-muted)",
};
