"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type EventType = "konusma" | "workshop" | "ara" | "toren" | "kapanis";

interface ProgramItem {
  saat: string;
  type: EventType;
  anaSalon?: string;
  konusmaci?: string;
  sozliBildiri?: string;
  workshop?: string;
  aciklama?: string;
  fullWidth?: boolean;
}

const gun1: ProgramItem[] = [
  {
    saat: "14.00 – 14.30",
    type: "toren",
    fullWidth: true,
    aciklama: "Kayıt ve Karşılama",
  },
  {
    saat: "14.30 – 15.15",
    type: "toren",
    fullWidth: true,
    aciklama: "Açılış Töreni: Saygı Duruşu, İstiklal Marşı ve Protokol Konuşmaları",
  },
  {
    saat: "15.15 – 15.30",
    type: "toren",
    fullWidth: true,
    aciklama: "Müzik Dinletisi (Teke Yöresi)",
  },
  {
    saat: "15.30 – 15.45",
    type: "ara",
    fullWidth: true,
    aciklama: "☕ Kahve Arası",
  },
  {
    saat: "15.45 – 16.30",
    type: "konusma",
    anaSalon: "Anterior Restorasyonlarda Estetiğe Giden Yol: Temel Prensipler ve Klinik Stratejiler",
    konusmaci: "Doç. Dr. Hakan Yasin GÖNDER",
  },
  {
    saat: "16.45 – 18.45",
    type: "workshop",
    workshop: "Doç. Dr. Hakan Yasin GÖNDER",
  },
];

const gun2: ProgramItem[] = [
  {
    saat: "09.30 – 10.10",
    type: "konusma",
    anaSalon: "Posterior Direkt Restorasyonlarda Pratik Klinik Yaklaşımlar",
    konusmaci: "Dr. Öğr. Üyesi Abdurrahman YALÇIN",
  },
  {
    saat: "10.20 – 11.00",
    type: "konusma",
    anaSalon: "Lazer Destekli Endodontik Tedavi: Gelenekten Geleceğe Minimalizm",
    konusmaci: "Prof. Dr. Taha ÖZYÜREK",
    workshop: "Dr. Öğr. Üyesi Abdurrahman YALÇIN",
  },
  {
    saat: "11.00 – 11.20",
    type: "ara",
    fullWidth: true,
    aciklama: "☕ Kahve Arası",
  },
  {
    saat: "11.20 – 12.00",
    type: "konusma",
    anaSalon: "TME Artrosentezinde Güncel Yaklaşımlar",
    konusmaci: "Prof. Dr. Mehmet Fatih ŞENTÜRK",
    sozliBildiri: "Sözlü Bildiri Oturumu 1",
  },
  {
    saat: "12.10 – 12.50",
    type: "konusma",
    anaSalon: "Kemik Yetersizliklerinde Cerrahi Uygulamalar ve Güncel Alternatif Yaklaşımlar",
    konusmaci: "Prof. Dr. Alper SİNDEL",
    sozliBildiri: "Sözlü Bildiri Oturumu 2",
  },
  {
    saat: "12.50 – 13.50",
    type: "ara",
    fullWidth: true,
    aciklama: "🍽 Öğle Arası",
  },
  {
    saat: "13.50 – 14.30",
    type: "konusma",
    anaSalon: "Sıfırdan Kliniğe Gerçek Deneyimler",
    konusmaci: "Dt. Onur YEDİKARA",
    sozliBildiri: "Sözlü Bildiri Oturumu 3",
    workshop: "Prof. Dr. Alper SİNDEL",
  },
  {
    saat: "14.40 – 15.20",
    type: "konusma",
    anaSalon: "Periodontal Plastik Cerrahiler",
    konusmaci: "Prof. Dr. Mükerrem HATİPOĞLU",
  },
  {
    saat: "15.20 – 15.40",
    type: "ara",
    fullWidth: true,
    aciklama: "☕ Kahve Arası",
  },
  {
    saat: "15.40 – 16.20",
    type: "konusma",
    anaSalon: "Full Ark İmplant Üstü Dijital Ölçümde Fotogrametri'nin Yeri",
    konusmaci: "Doç. Dr. Kubilay BARUTÇUGIL",
  },
  {
    saat: "16.30 – 17.10",
    type: "konusma",
    anaSalon: "Çene Cerrahisinde Komplikasyon Yönetimi: Küçük Hatalar, Büyük Problemler",
    konusmaci: "Uzm. Dt. Burak MENGÜTAŞ",
  },
  {
    saat: "17.20 – 18.00",
    type: "kapanis",
    fullWidth: true,
    aciklama: "Kapanış, Dilek ve Temenniler",
  },
];

const rowBg: Record<EventType, string> = {
  konusma: "transparent",
  workshop: "#fdf4e8",
  ara: "#f5f0eb",
  toren: "#f0f6ff",
  kapanis: "#f0f6ff",
};

const tagStyle: Record<EventType, React.CSSProperties> = {
  konusma: { background: "#e8f4e8", color: "#2d6e2d", border: "1px solid #b8ddb8" },
  workshop: { background: "#fdf0d8", color: "#8f5e00", border: "1px solid #f0c878" },
  ara: { background: "#ece8e3", color: "#6b6460", border: "1px solid #d4cdc8" },
  toren: { background: "#e8f0fd", color: "#1a4a8a", border: "1px solid #b8ccf0" },
  kapanis: { background: "#e8f0fd", color: "#1a4a8a", border: "1px solid #b8ccf0" },
};

const tagLabel: Record<EventType, string> = {
  konusma: "Konuşma",
  workshop: "Workshop",
  ara: "Ara",
  toren: "Tören",
  kapanis: "Kapanış",
};

export default function ProgramPage() {
  const [aktifGun, setAktifGun] = useState<1 | 2>(1);
  const program = aktifGun === 1 ? gun1 : gun2;

  return (
    <>
      <Navbar />
      <div style={{
        paddingTop: "6rem",
        minHeight: "100vh",
        background: "linear-gradient(160deg, var(--bg-primary) 60%, var(--bg-secondary) 100%)",
        paddingBottom: "4rem",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "3rem 1.5rem 0" }}>

          {/* Başlık */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ width: "48px", height: "3px", background: "var(--primary-500)", margin: "0 auto 1.5rem", borderRadius: "2px" }} />
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "4px", textTransform: "uppercase", color: "var(--primary-500)", marginBottom: "1rem" }}>
              Bilimsel Program
            </p>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "var(--text-primary)", fontWeight: 700, marginBottom: "0.8rem" }}>
              MADOK 2026
            </h1>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--text-muted)", fontSize: "1rem" }}>
              19 – 20 Haziran 2026 · MAKÜ Merkez Kampüs, Burdur
            </p>
          </div>

          {/* Gün Sekmeleri */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", justifyContent: "center" }}>
            {([1, 2] as const).map((gun) => (
              <button
                key={gun}
                onClick={() => setAktifGun(gun)}
                style={{
                  padding: "0.7rem 2rem",
                  borderRadius: "50px",
                  border: aktifGun === gun ? "2px solid var(--primary-500)" : "2px solid var(--border-color, #e0d8d0)",
                  background: aktifGun === gun ? "var(--primary-500)" : "white",
                  color: aktifGun === gun ? "white" : "var(--text-muted)",
                  fontFamily: "var(--font-ui)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  letterSpacing: "0.5px",
                  transition: "all 0.2s",
                }}
              >
                {gun === 1 ? "19 Haziran · Cuma" : "20 Haziran · Cumartesi"}
              </button>
            ))}
          </div>

          {/* Salon Başlıkları */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "110px 1fr 1fr 1fr",
            gap: "1px",
            background: "var(--primary-200, #d4c8bc)",
            borderRadius: "12px 12px 0 0",
            overflow: "hidden",
            border: "1px solid var(--primary-200, #d4c8bc)",
          }}>
            {["Saat", "Ana Salon", "Sözlü Bildiri", "Workshop"].map((col) => (
              <div key={col} style={{
                background: "var(--primary-600, #7a5a40)",
                color: "white",
                padding: "0.75rem 1rem",
                fontFamily: "var(--font-ui)",
                fontWeight: 700,
                fontSize: "0.78rem",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textAlign: "center",
              }}>
                {col}
              </div>
            ))}
          </div>

          {/* Program Satırları */}
          <div style={{
            border: "1px solid var(--primary-200, #d4c8bc)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            overflow: "hidden",
          }}>
            {program.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: item.fullWidth ? "110px 1fr" : "110px 1fr 1fr 1fr",
                  background: i % 2 === 0 ? rowBg[item.type] : (item.type === "ara" || item.type === "toren" || item.type === "kapanis" ? "#ede8e2" : "#fafaf8"),
                  borderBottom: i < program.length - 1 ? "1px solid var(--primary-100, #ede6de)" : "none",
                  minHeight: "64px",
                }}
              >
                {/* Saat */}
                <div style={{
                  padding: "0.9rem 0.75rem",
                  fontFamily: "var(--font-ui)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  color: "var(--primary-700, #5a3a22)",
                  borderRight: "1px solid var(--primary-100, #ede6de)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}>
                  {item.saat}
                </div>

                {item.fullWidth ? (
                  /* Full width satır */
                  <div style={{
                    padding: "0.9rem 1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}>
                    <span style={{
                      ...tagStyle[item.type],
                      padding: "0.2rem 0.65rem",
                      borderRadius: "20px",
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-ui)",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}>
                      {tagLabel[item.type]}
                    </span>
                    <span style={{
                      fontFamily: "var(--font-ui)",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                    }}>
                      {item.aciklama}
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Ana Salon */}
                    <div style={{ padding: "0.9rem 1rem", borderRight: "1px solid var(--primary-100, #ede6de)" }}>
                      {item.anaSalon ? (
                        <>
                          <p style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "0.8rem", color: "var(--primary-700, #5a3a22)", marginBottom: "0.3rem" }}>
                            {item.konusmaci}
                          </p>
                          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-secondary, #555)", lineHeight: 1.5, fontStyle: "italic" }}>
                            &ldquo;{item.anaSalon}&rdquo;
                          </p>
                        </>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>—</span>
                      )}
                    </div>

                    {/* Sözlü Bildiri */}
                    <div style={{ padding: "0.9rem 1rem", borderRight: "1px solid var(--primary-100, #ede6de)", display: "flex", alignItems: "center" }}>
                      {item.sozliBildiri ? (
                        <span style={{
                          background: "#eef2ff",
                          color: "#3a4fa8",
                          border: "1px solid #c5cdf0",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontFamily: "var(--font-ui)",
                          fontWeight: 600,
                        }}>
                          {item.sozliBildiri}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>—</span>
                      )}
                    </div>

                    {/* Workshop */}
                    <div style={{ padding: "0.9rem 1rem", display: "flex", alignItems: "center" }}>
                      {item.workshop ? (
                        <div>
                          <span style={{
                            background: "#fdf0d8",
                            color: "#8f5e00",
                            border: "1px solid #f0c878",
                            padding: "0.2rem 0.65rem",
                            borderRadius: "20px",
                            fontSize: "0.7rem",
                            fontFamily: "var(--font-ui)",
                            fontWeight: 700,
                            display: "inline-block",
                            marginBottom: "0.25rem",
                          }}>
                            Workshop
                          </span>
                          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--primary-700, #5a3a22)", fontWeight: 600 }}>
                            {item.workshop}
                          </p>
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>—</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobil not */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            * Program bilgileri değişebilir. Güncel bilgi için sitemizi takip edin.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
