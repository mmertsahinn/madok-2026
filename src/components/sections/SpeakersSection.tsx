import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const speakers = [
  {
    name: "Prof. Dr. Taha Özyürek",
    unvan: "Prof. Dr.",
    alan: "Endodonti",
    img: "/hocalar/prof. dr. taha özyürek.jpeg",
  },
  {
    name: "Prof. Dr. Mehmet Fatih Şentürk",
    unvan: "Prof. Dr.",
    alan: "Periodontoloji",
    img: "/hocalar/prof.dr. mehmet fatih şentürk.jpeg",
  },
  {
    name: "Do. Dr. Hakan Yasin Gönder",
    unvan: "Doç. Dr.",
    alan: "Ağız, Diş ve Çene Cerrahisi",
    img: "/hocalar/do.dr Hakan yasin gönder.jpeg",
  },
  {
    name: "Dr. Öğr. Üyesi Abdurrahman Yalçın",
    unvan: "Dr. Öğr. Üyesi",
    alan: "Protetik Diş Tedavisi",
    img: "/hocalar/dr.öğr.üyesi abdurrahman yalçın.jpeg",
  },
  {
    name: "Dt. Onur Yedikara",
    unvan: "Dt.",
    alan: "Ortodonti",
    img: "/hocalar/dt.onur yedikara.jpeg",
  },
  {
    name: "Uzm. Dt. Burakt Mengütaş",
    unvan: "Uzm. Dt.",
    alan: "Pedodonti",
    img: "/hocalar/uzm.dt. burakt mengütaş.jpeg",
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
              <div className="speaker-card">
                <div className="speaker-avatar" style={{ padding: 0, overflow: "hidden", background: "transparent" }}>
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
