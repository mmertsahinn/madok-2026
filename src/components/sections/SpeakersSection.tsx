import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const speakers = [
  {
    name: "Prof. Dr. Kürşat ER",
    unvan: "Prof. Dr.",
    alan: "Endodonti",
    img: "/hocalar/prof. dr. kürşat er.jpeg",
    onurKonugu: true,
  },
  {
    name: "Prof. Dr. Taha ÖZYÜREK",
    unvan: "Prof. Dr.",
    alan: "Endodonti",
    img: "/hocalar/prof. dr. taha özyürek.jpeg",
  },
  {
    name: "Prof. Dr. Mehmet Fatih ŞENTÜRK",
    unvan: "Prof. Dr.",
    alan: "Ağız Diş Çene Cerrahisi",
    img: "/hocalar/prof.dr. mehmet fatih şentürk.jpeg",
  },
  {
    name: "Dr. Öğr. Üyesi Abdurrahman YALÇIN",
    unvan: "Dr. Öğr. Üyesi",
    alan: "Restoratif Diş Tedavisi",
    img: "/hocalar/dr.öğr.üyesi abdurrahman yalçın.jpeg",
  },
  {
    name: "Dt. Onur YEDİKARA",
    unvan: "Dt.",
    alan: "Genel Diş Hekimi",
    img: "/hocalar/dt.onur yedikara.jpeg",
  },
  {
    name: "Uzm. Dt. Burak MENGÜTAŞ",
    unvan: "Uzm. Dt.",
    alan: "Ağız Diş Çene Cerrahisi",
    img: "/hocalar/uzm.dt. burakt mengütaş.jpeg",
  },
  {
    name: "Doç. Dr. Kubilay BARUTÇUGIL",
    unvan: "Doç. Dr.",
    alan: "Protetik Diş Tedavisi",
    img: "/hocalar/doç.dr. kubilay barutçugil.jpeg",
  },
  {
    name: "Prof. Dr. Alper SİNDEL",
    unvan: "Prof. Dr.",
    alan: "Ağız Diş Çene Cerrahisi",
    img: "/hocalar/prof. dr. alper sindel.jpeg",
  },
  {
    name: "Prof. Dr. Mükerrem HATİPOĞLU",
    unvan: "Prof. Dr.",
    alan: "Periodontoloji",
    img: "/hocalar/prof. dr. mükerrem hatipoglu.jpeg",
  },
];

export default function SpeakersSection() {
  return (
    <section className="section" id="konusmacilar">
      <div className="section-container">
        <ScrollReveal>
          <div className="section-header">
            <p className="section-overline">Konuşmacılar</p>
            <h2 className="section-title">Alanında Uzman İsimler</h2>
            <p className="section-desc">
              Ulusal alanda öncü araştırmacılar ve klinisyenler MADOK 2026&apos;da.
            </p>
          </div>
        </ScrollReveal>

        <div className="speakers-grid">
          {speakers.map((s, i) => (
            <ScrollReveal key={i}>
              <div
                className="speaker-card"
                style={s.onurKonugu ? {
                  border: "1.5px solid rgba(203, 168, 103, 0.45)",
                  boxShadow: "0 0 18px rgba(203, 168, 103, 0.18)",
                  background: "linear-gradient(160deg, #fffdf7 0%, #fff 100%)",
                } : undefined}
              >
                <div
                  className="speaker-avatar"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    background: "transparent",
                    ...(s.onurKonugu ? {
                      boxShadow: "0 0 0 2.5px rgba(203, 168, 103, 0.5)",
                      borderRadius: "50%",
                    } : {}),
                  }}
                >
                  <Image
                    src={s.img}
                    alt={s.name}
                    width={120}
                    height={120}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                    unoptimized
                  />
                </div>
                <div className="speaker-info">
                  <p className="speaker-specialty">{s.alan}</p>
                  <h3 className="speaker-name">{s.name}</h3>
                  <p className="speaker-title-text">{s.unvan}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
