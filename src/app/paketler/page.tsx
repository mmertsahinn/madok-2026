import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kayıt & Paketler | MADOK 2026",
  description: "MADOK 2026 Kongresi kayıt paketleri ve ücretleri. Erken kayıt avantajlarından yararlanın.",
};

const packages = [
  {
    type: "Öğrenci",
    name: "Öğrenci Paketi",
    earlyPrice: "750 ₺",
    normalPrice: "1.000 ₺",
    period: "Erken Kayıt: 1 Haz – 15 Ağu 2026",
    featured: false,
    features: [
      { text: "Tüm bilimsel oturumlara katılım", included: true },
      { text: "Kongre çantası ve materyaller", included: true },
      { text: "Çay / kahve ikramları", included: true },
      { text: "Öğle yemekleri (3 gün)", included: true },
      { text: "E-sertifika", included: true },
      { text: "Gala yemeği", included: false },
      { text: "Workshop katılımı", included: false },
      { text: "VIP networking", included: false },
    ],
  },
  {
    type: "Akademisyen",
    name: "Akademisyen Paketi",
    earlyPrice: "1.500 ₺",
    normalPrice: "2.000 ₺",
    period: "Erken Kayıt: 1 Haz – 15 Ağu 2026",
    featured: true,
    features: [
      { text: "Tüm bilimsel oturumlara katılım", included: true },
      { text: "Kongre çantası ve materyaller", included: true },
      { text: "Çay / kahve ikramları", included: true },
      { text: "Öğle yemekleri (3 gün)", included: true },
      { text: "E-sertifika", included: true },
      { text: "Gala yemeği", included: true },
      { text: "1 workshop katılımı", included: true },
      { text: "VIP networking", included: false },
    ],
  },
  {
    type: "Profesyonel",
    name: "Profesyonel Paket",
    earlyPrice: "2.500 ₺",
    normalPrice: "3.500 ₺",
    period: "Erken Kayıt: 1 Haz – 15 Ağu 2026",
    featured: false,
    features: [
      { text: "Tüm bilimsel oturumlara katılım", included: true },
      { text: "Kongre çantası ve premium materyaller", included: true },
      { text: "Çay / kahve ikramları", included: true },
      { text: "Öğle yemekleri (3 gün)", included: true },
      { text: "Basılı & E-sertifika", included: true },
      { text: "Gala yemeği + kokteyl", included: true },
      { text: "Tüm workshop'lara katılım", included: true },
      { text: "VIP networking etkinliği", included: true },
    ],
  },
];

const addons = [
  { name: "Ek Workshop Katılımı",    price: "300 ₺",   desc: "Paket dışı her ek workshop için" },
  { name: "Gala Yemeği — Ek Misafir", price: "500 ₺", desc: "Eşlik eden misafir için gala yemeği" },
  { name: "Konaklama Paketi",        price: "1.200 ₺", desc: "3 gece anlaşmalı otelde konaklama" },
  { name: "Havalimanı Transferi",    price: "200 ₺",   desc: "Havalimanı – otel – kongre merkezi" },
];

const faqs = [
  { q: "Kayıt iptali yapabilir miyim?", a: "Kongre başlangıcından 30 gün öncesine kadar tam iade, 15 gün öncesine kadar %50 iade yapılmaktadır." },
  { q: "Fatura alabilir miyim?", a: "Evet, kayıt sırasında fatura bilgilerinizi girebilirsiniz. E-fatura kayıt sonrası mail adresinize gönderilecektir." },
  { q: "Bildiri göndermek için kayıt yaptırmam gerekiyor mu?", a: "Bildiri gönderimi için ön kayıt yeterlidir. Bildiri kabul edildikten sonra tam kayıt yapmanız gerekmektedir." },
  { q: "Katılım sertifikası veriliyor mu?", a: "Evet, kongreye katılan tüm katılımcılara e-sertifika verilecektir. Profesyonel pakette basılı sertifika da dahildir." },
];

/* ── CHECK / CROSS SVG ── */
function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 5.5L4 7.5L8 3" stroke="var(--primary-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Cross() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M3 3L7 7M7 3L3 7" stroke="var(--neutral-400)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function PaketlerPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="packages-hero">
        <div className="section-container">
          <ScrollReveal>
            <p className="section-overline">Kayıt &amp; Paketler</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "1rem" }}>
              Size Uygun Paketi Seçin
            </h1>
            <p className="section-desc" style={{ marginBottom: 0 }}>
              MADOK 2026 Kongresi için erken kayıt fırsatlarından yararlanın.
              Tüm paketlere KDV dahildir.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Ödeme Bilgileri */}
      <section className="section section-alt">
        <div className="section-container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-overline">Ödeme Bilgileri</p>
              <h2 className="section-title">Banka Hesap Bilgileri</h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div style={paymentBox}>
              <div style={paymentBlock}>
                <h3 style={paymentBlockTitle}>Havale / EFT</h3>
                <p style={{ ...paymentBlockDesc, marginBottom: "1.5rem" }}>
                  Banka havalesi ile ödeme yapmak isteyen katılımcılarımız aşağıdaki hesap bilgilerini kullanabilir. Ödeme yaparken açıklama kısmına <strong>Ad Soyad ve MADOK2026</strong> yazılması zorunludur.
                </p>
                <div style={ibanBox}>
                  <div style={ibanRow}><span style={ibanKey}>Alıcı (Hesap Sahibi)</span><span style={ibanVal}>M.A.ERSOY ÜNV.REKTÖRLÜĞÜ STRATEJİ GELŞ.DAİRE BŞK.</span></div>
                  <div style={{ ...ibanRow, borderBottom: "none" }}><span style={ibanKey}>IBAN</span><span style={ibanVal}>TR62 0001 0015 8254 4728 4452 80</span></div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Fiyat Tablosu */}
      <section className="section">
        <div className="section-container">
          <ScrollReveal>
            <div style={tableWrapper}>
              <table style={pricingTable}>
                <thead>
                  <tr>
                    <th style={thStyle}>Kategori</th>
                    <th style={thStyle}>Kongre Kayıt (₺)</th>
                    <th style={thStyle}>Workshop (Adet Başına ₺)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>MAKÜ Öğrenci</td>
                    <td style={tdValueStyle}>850 ₺</td>
                    <td style={tdValueStyle}>1.500 ₺</td>
                  </tr>
                  <tr>
                    <td style={tdAltStyle}>Öğrenci (MAKÜ Dışı)</td>
                    <td style={tdAltValueStyle}>1.350 ₺</td>
                    <td style={tdAltValueStyle}>1.500 ₺</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Diş Hekimi / Akademisyen</td>
                    <td style={tdValueStyle}>2.000 ₺</td>
                    <td style={tdValueStyle}>3.000 ₺</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Link href="/odeme" className="btn-gold" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", borderRadius: "10px", display: "inline-block" }}>
                Hemen Kayıt Ol
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SSS */}
      <section className="section">
        <div className="section-container">
          <ScrollReveal>
            <div className="section-header">
              <p className="section-overline">SSS</p>
              <h2 className="section-title">Sık Sorulan Sorular</h2>
            </div>
          </ScrollReveal>

          <div style={faqList}>
            {faqs.map((faq, i) => (
              <ScrollReveal key={i}>
                <div style={faqCard}>
                  <div style={faqQ}>{faq.q}</div>
                  <div style={faqA}>{faq.a}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ── STYLES ── */
import type React from "react";

const packagesGrid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem",
};
const pkgCard: React.CSSProperties = {
  borderRadius: "20px", overflow: "hidden", display: "flex",
  flexDirection: "column", transition: "transform 0.3s, box-shadow 0.3s",
};
const pkgTop: React.CSSProperties = {
  padding: "2rem 2rem 1.5rem", borderBottom: "1px solid var(--neutral-200)", position: "relative",
};
const pkgBadge: React.CSSProperties = {
  position: "absolute", top: "1.2rem", right: "1.2rem",
  fontFamily: "var(--font-ui)", fontSize: "0.68rem", fontWeight: 700,
  textTransform: "uppercase" as const, letterSpacing: "1.5px",
  padding: "0.3rem 0.75rem", borderRadius: "50px",
  background: "var(--gold-400)", color: "var(--neutral-950)",
};
const pkgType: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.72rem", fontWeight: 700,
  textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: "0.5rem",
};
const pkgName: React.CSSProperties = {
  fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem",
};
const pkgPriceRow: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: "0.5rem" };
const pkgPrice: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "2rem", fontWeight: 700 };
const pkgPriceLabel: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.8rem" };
const pkgNormal: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.78rem", marginTop: "0.3rem" };
const pkgBody: React.CSSProperties = { padding: "1.5rem 2rem", flex: 1, background: "white" };
const pkgFeatures: React.CSSProperties = { listStyle: "none", display: "flex", flexDirection: "column", gap: "0.8rem" };
const pkgFeatItem: React.CSSProperties = { display: "flex", alignItems: "center", gap: "0.75rem" };
const featCheck: React.CSSProperties = {
  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
};
const featText: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.85rem" };
const pkgFooter: React.CSSProperties = { padding: "1.5rem 2rem" };
const pkgBtn: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
  width: "100%", padding: "0.9rem", borderRadius: "10px", cursor: "pointer",
  fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 600,
  textDecoration: "none", transition: "all 0.2s",
};
const addonsGrid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(2,1fr)",
  gap: "1px", background: "var(--neutral-200)",
  border: "1px solid var(--neutral-200)", borderRadius: "16px", overflow: "hidden",
};
const addonCell: React.CSSProperties = {
  background: "white", padding: "1.8rem 2rem",
  display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
};
const addonInfo: React.CSSProperties = { flex: 1 };
const addonName: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.925rem", fontWeight: 600,
  color: "var(--text-primary)", marginBottom: "0.2rem",
};
const addonDesc: React.CSSProperties = { fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--text-muted)" };
const addonPrice: React.CSSProperties = {
  fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 600,
  color: "var(--primary-600)", whiteSpace: "nowrap" as const,
};
const paymentBox: React.CSSProperties = {
  maxWidth: "700px", margin: "0 auto", background: "white",
  borderRadius: "20px", border: "1px solid var(--neutral-200)", padding: "2.5rem",
};
const paymentBlock: React.CSSProperties = { marginBottom: "0" };
const paymentBlockTitle: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.875rem", fontWeight: 700,
  color: "var(--text-primary)", marginBottom: "0.6rem",
};
const paymentBlockDesc: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.7,
};
const paymentDivider: React.CSSProperties = {
  height: "1px", background: "var(--neutral-200)", margin: "2rem 0",
};
const ibanBox: React.CSSProperties = {
  background: "var(--bg-secondary)", borderRadius: "12px", padding: "0.5rem 1.2rem",
};
const ibanRow: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "0.55rem 0", borderBottom: "1px solid var(--neutral-200)",
};
const ibanKey: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--text-muted)",
};
const ibanVal: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)",
};
const faqList: React.CSSProperties = {
  display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "800px", margin: "0 auto",
};
const faqCard: React.CSSProperties = {
  background: "white", border: "1px solid var(--neutral-200)",
  borderRadius: "14px", padding: "1.5rem 2rem",
};
const faqQ: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.95rem", fontWeight: 600,
  color: "var(--text-primary)", marginBottom: "0.5rem",
};
const faqA: React.CSSProperties = {
  fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65,
};

const tableWrapper: React.CSSProperties = {
  width: "100%", overflowX: "auto", margin: "0 auto", maxWidth: "900px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderRadius: "12px", background: "white",
};

const pricingTable: React.CSSProperties = {
  width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)",
};

const thStyle: React.CSSProperties = {
  background: "var(--primary-800)", color: "white", padding: "1.2rem 1rem",
  textAlign: "left", fontSize: "1.05rem", fontWeight: 600, borderBottom: "2px solid var(--primary-900)",
};

const tdStyle: React.CSSProperties = {
  padding: "1.2rem 1rem", borderBottom: "1px solid var(--neutral-200)",
  fontSize: "1rem", color: "var(--text-primary)", fontWeight: 500,
};

const tdValueStyle: React.CSSProperties = {
  ...tdStyle, fontWeight: 700, color: "var(--primary-600)",
};

const tdAltStyle: React.CSSProperties = {
  ...tdStyle, background: "var(--bg-secondary)",
};

const tdAltValueStyle: React.CSSProperties = {
  ...tdValueStyle, background: "var(--bg-secondary)",
};
